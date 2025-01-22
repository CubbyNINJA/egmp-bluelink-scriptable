import { ioniq5 } from "resources/images"

const KEYCHAIN_CACHE_KEY = "bluelink-cache"
const DEFAULT_STATUS_CHECK_INTERVAL = 3600

export interface BluelinkCreds {
  username: string
  password: string
  region: string
  pin: string
}

export interface BluelinkTokens {
  accessToken: string
  expiry: number
}

export interface BluelinkCar {
  id: string
  vin: string
  nickName: string
  modelName: string
  modelYear: string
  modelTrim: string
  modelColour: string 
}

export interface BluelinkStatus {
  lastStatusCheck: number
  lastRemoteStatusCheck: string
  isCharging: boolean
  chargingPower: number
  remainingChargeTimeMins: number 
  range: number
  locked: boolean
  climate: boolean
  soc: number
  twelveSoc: number
  odometer: number
}

export interface Status {
  car: BluelinkCar,
  status: BluelinkStatus
}

export interface Cache {
  token: BluelinkTokens
  car: BluelinkCar
  status: BluelinkStatus 
}

export interface RequestProps {
  url: string
  data?: string
  method?: string
  noAuth?: boolean
  headers?: Record<string, string>
}

export interface DebugLastRequest {
  url: string
  method: string
  data?: string
  headers: Record<string, string>
}

export interface TempConversion {
    F: number[]
    C: number[]
    H: string[]
}

export interface ClimateRequest {
  enable: boolean,
  defrost: boolean,
  steering: boolean
  temp: number,
  durationMinutes: number,
}

export class Bluelink {
   // @ts-ignore - creds is initalized in init
  protected creds: BluelinkCreds
  // @ts-ignore - cache is initalized in init
  protected cache: Cache
  protected vin: string | undefined
  // @ts-ignore - statusCheckInterval is initalized in init
  protected statusCheckInterval: number

  protected additionalHeaders :Record<string, string>
  protected authHeader: string
  protected tempLookup: TempConversion | undefined
  protected tokens: BluelinkTokens | undefined
  protected debugLastRequest: DebugLastRequest | undefined

  constructor(creds: BluelinkCreds, vin?: string, statusCheckInterval?: number) {
    this.additionalHeaders = {}
    this.authHeader = "Authentication"
    this.tokens = undefined
    this.debugLastRequest = undefined
    this.tempLookup = undefined
  }

  protected async superInit(creds: BluelinkCreds, vin?: string, statusCheckInterval?: number) {
    this.creds = creds
    this.vin = vin
    this.statusCheckInterval = statusCheckInterval || DEFAULT_STATUS_CHECK_INTERVAL
    this.cache = await this.loadCache()
    if (! this.tokenValid()) {
      this.cache.token = await this.login()
      this.saveCache()
    }
  }

  public getCachedStatus(): Status {
    return {
      car: this.cache.car,
      status: this.cache.status
    }
  }

  public async getStatus(forceUpdate: boolean) : Promise<Status> {
    if (forceUpdate) {
      this.cache.status = await this.getCarStatus(this.cache.car.id, true)
      this.saveCache()
    } else if (this.cache.status.lastStatusCheck + this.statusCheckInterval < Math.floor(Date.now()/1000)) {
      this.cache.status = await this.getCarStatus(this.cache.car.id, false)
      this.saveCache()
    }
    return {
      car: this.cache.car,
      status: this.cache.status
    }
  }

  public async processRequest(type: string, input: any, callback: (isComplete: boolean, didSucceed: boolean, data: any | undefined) => void) {
    let promise : Promise<any> | undefined = undefined
    let data : any
    let didSucceed = false
    switch(type) {
      case "status":
        promise = this.getStatus(true)
        break
      case "lock":
        promise = this.lock(this.cache.car.id)
        break
      case "unlock":
        promise = this.unlock(this.cache.car.id)
        break
      case "startCharge":
        promise = this.startCharge(this.cache.car.id)
        break
      case "stopCharge":
        promise = this.stopCharge(this.cache.car.id)
        break
      case "climate":
        if (! input) {
          throw Error("Must provide valid input for climate request!")
        }
        const inputClimate = input as ClimateRequest
        promise = (inputClimate.enable) ? this.climateOn(this.cache.car.id, input) : this.climateOff(this.cache.car.id)
        break
      default:
        throw Error(`Unsupported request ${type}`)
    }
    let hasRequestCompleted = false
    const timer = Timer.schedule(500, true, async () => {
      if (!hasRequestCompleted) {
        callback(false, false, undefined)
      } else {
        timer.invalidate()
        callback(true, didSucceed, data)
      }
    })

    try {
      data = await promise
      hasRequestCompleted = true
      didSucceed = true
    } catch (error) {
      hasRequestCompleted = true
      didSucceed = false
      data = error
    }
  }

  protected saveCache() {
    Keychain.set(KEYCHAIN_CACHE_KEY, JSON.stringify(this.cache))
  }

  protected async loadCache() : Promise<Cache> {
    let cache : Cache | undefined = undefined
    if (Keychain.contains(KEYCHAIN_CACHE_KEY)) {
      cache = JSON.parse(Keychain.get(KEYCHAIN_CACHE_KEY))
    } 
    if (!cache) {
      // initial use - load car and status
      this.tokens = await this.login()
      const car = await this.getCar()
      cache = {
        token: this.tokens,
        car: car,
        status: await this.getCarStatus(car.id, false)
      }
    }
    this.cache = cache
    this.saveCache()
    return this.cache
  }

  protected tokenValid(): boolean {
    // invalid if within 30 seconds of expiry
    return (this.cache.token.expiry - 30) > Math.floor(Date.now()/1000)
  }

  protected async request(props: RequestProps) : Promise<any> {
    const req = new Request(props.url)
    req.method = (props.method) ? props.method : (props.data) ? "POST" : "GET"
    req.headers = {
      "Accept": "application/json",
      ...(props.data) && {
        "Content-Type": "application/json"
      },
      ...(! props.noAuth) && {
        [this.authHeader]: this.tokens ? this.tokens?.accessToken : this.cache.token.accessToken
      },
      ...this.additionalHeaders,
      ...(props.headers) && {
        ...props.headers
      }
    }    
    if (props.data) { 
      req.body = props.data
    }

    this.debugLastRequest = {
      url: props.url,
      method: req.method,
      headers: req.headers,
      ...(props.data) && {
        data: req.body
      }
    }
    // logError(`Sending request to ${props.url}`)
    try {
      return await req.loadJSON()
    } catch (error) {
      logError(`Failed to send request to ${props.url}, error ${error}`)
    }
    
  }

  public getCarImage() : string {
    return ioniq5
  }

  protected async sleep(milliseconds: number) : Promise<void>{
    return new Promise(resolve => {
      Timer.schedule(milliseconds, false, () => resolve())
    })
  }

  protected async login() : Promise<BluelinkTokens> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async getCarStatus(id: string, forceUpdate: boolean) : Promise<BluelinkStatus> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async getCar() : Promise<BluelinkCar> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async lock(id: string) : Promise<{ isSuccess: boolean, data: any}> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async unlock(id: string) : Promise<{ isSuccess: boolean, data: any}> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async startCharge(id: string):  Promise<{ isSuccess: boolean, data: any}> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async stopCharge(id: string):  Promise<{ isSuccess: boolean, data: any}> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async climateOn(id: string, config: ClimateRequest) : Promise<{ isSuccess: boolean, data: any}> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }

  protected async climateOff(id: string) : Promise<{ isSuccess: boolean, data: any}> {
    // implemented in country specific sub-class
    throw Error("Not Implemented")
  }
}