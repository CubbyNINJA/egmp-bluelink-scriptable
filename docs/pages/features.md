---
title: Features
layout: home
nav_order: 2
---

# Bluelink Scriptable feature set

The app is designed to perform  a subset of the main Hyundai / Kia app, but the subset that makes up for 99% of your usage. 

The app is driven through the main widget, which can sit on any homescreen of your choosing - clicking on the widget opens the app automatically, swiping away closes it. The widget automatically updates the data displayed regularly, attempting to balance freshness of data while limiting the amount of remote connections to the car.

The app also supports the use of Siri Shortcuts, allowing you to ask siri to ***"get the status of the car"***, or ***"start warming the car"***. See the Siri Shortcuts section for more info.

The widget reguarly queries the bluelink API to retrieve the lastest data on the server, however this is typically cached data as the car only updates the bluelinks servers on very in-frequent basis. 

The app also supports performing "remote refreshes" which actually queries the car and gets the most upto date information from the car. Within the app clicking the status icon will cause a remote refresh, the widget can also perform remote refreshes on a schedule - this feature needs to be opted into within the settings screen.

> IMPORTANT NOTE: Too many remote refresh commands will drain the 12v battery in the car, which in a worst case situation will cause the car to not be able to start. The widget has been configured to be very careful on the number of remote refresh commands sent, however buyer beware - hence the opt-in - I take no liabiity for any 12v failures based on the abuse of this feature.

# Supported Keywords
The following keywords are supported:


## Status

### Remote Status
The app queries the Bluelink API to retireve information on the SOC (State of Charge), charging status, charging completion date/time, lock/unlock, climate and finally the 12v battery charge percentage.

### Status
This will return the latest status of the car from the Bluelink API. Typically this will be a sentence stating charge status, if the car is locked and if the car is charging (and if it is when it will finish charging).


## Lock/Security
### Lock
This will issue a remote lock command to the car

### Unlock
This will issue a remote un-lock command to the car


## Climate

### Cool
This will issue a remote command to pre-cool the car.

### Warm
This will issue a remote command to pre-heat the car.

### Climate off
This will issue a remote command to stop the climate controls in the car.


## Charging

### Start charging
This will issue a remote command to start charging the car.

### Stop charging
This will issue a remote command to stop charging the car.




----
