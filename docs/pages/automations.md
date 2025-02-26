---
title: Automations
layout: home
nav_order: 5
---
# Shortcuts
Shortcuts can be added to your homescreen or Mission Control drop down to perform actions with a single press. 

### Base Shortcuts
For ease of maintance there are 2 base shortcuts that should be installed. 

Set EGMP Script allows you to set the name of the scriptable script name once, so if a name changes you update 1 shortcut instead of them all, simlar like a global/constant variable. 

[Set EGMP Script](https://www.icloud.com/shortcuts/9e8eea220a724a5681845b6ad7310cc7)

Get Status will do a Remote Status command, pause, and then a Status command and return the car status to be used by IF statmenets in other shortcuts  

[Get Status](https://www.icloud.com/shortcuts/d5a43ab5fa57449281dfb80e23db24f0)

### Auto Climate Control
> Requires Set EGMP Script and Get Status base shortcuts

Auto Climate Control will pull the local weahter weather, if it is 5°C or less, it will trigger the "Warm" Climate command, If it is 25°C or greater, it will trigger the "Cool" command, and then show a notification. for tempratures between 6°C and 24°C nothing will be done. 

[Auto Climate Control](https://www.icloud.com/shortcuts/8f715425cc0440519ede0dcfbb0f6fbb)

### Get Car Status
> Requires Set EGMP Script base shortcut

Get Car Status does the same actions as the Get Status base shortcut, but will show the status in a prompt after retriving the information.

[Get Car Status](https://www.icloud.com/shortcuts/fe854046ab8849eca0f2e75a441c94e8)

### Lock Car
> Requires Set EGMP Script base shortcut

Lock Car will simply send a lock command regardless of the car's status

[Lock Car](https://www.icloud.com/shortcuts/9f19f84c2c974fc59d77cd9855aee2e9)

### Toggle Charge
> Requires Set EGMP Script and Get Status base shortcuts

Toggle Charge will pull the cars current status, if the car is charging it will send a stop charging command, if its not charging and plugged in it will send a start charging command, then send a push notification.

[Toggle Charge](https://www.icloud.com/shortcuts/e2bf22cb720f48ebbfe235ef8c5425e4)

### Toggle Lock
> Requires Set EGMP Script and Get Status base shortcuts

Toggle Lock will pull the cars current status, if the car is locked it will send a unlock command, if its not locked it will send a lock command, then send a push notification.

[Toggle Lock](https://www.icloud.com/shortcuts/bceb9e50bf13454192e38dbd87e96feb)

### Turn Off Climate
> Requires Set EGMP Script base shortcut

Turn Off Climate will simply send a turn off climate command regardless of the car's status

[Turn Off Climate](https://www.icloud.com/shortcuts/284e048645f74f25afe8122fae7c2c80)

### Templates
> Requires Set EGMP Script and Get Status base shortcuts

Below are 2 templates to import and duplicate to use as your base for other shortcuts/command combinations

[EGMP Single Command Template](https://www.icloud.com/shortcuts/bea4c5cf6dee4ab2b0b0b1d3494e6264)

[EGMP Toggle Template](https://www.icloud.com/shortcuts/11d05b8d476244f38719acb615fed3e0)
<br>
<br>
# Automations

Using IOS Shortcuts it is possible to configure a number if automations. A automation is a combination of a defined shortcut and then an automation that will trigger that shortcut [based on a IOS supported event](https://support.apple.com/en-ca/guide/shortcuts/apd932ff833f/ios). Both the shortcut itself and the automation are created within the Shortcuts app.

Any shortcut automation will need to invoke the app with a given command - as a text string. The list of commands are described on the [Siri](./siri.md) page.

Below are a few example automations, and their downloadable Shortcut script(s). The provided shortcuts are examples, and should be modified by you to be appropiate for what you want to achieve.

### Walk Away Lock

This automation will send a lock command to the car, after a delay. The triggering event can either be disconnecting from CarPlay or disconnecting from the Car's Bluetooth.

[Set EGMP Script](https://www.icloud.com/shortcuts/9e8eea220a724a5681845b6ad7310cc7)
[Lock Car](https://www.icloud.com/shortcuts/9f19f84c2c974fc59d77cd9855aee2e9)

To setup the automation, perform the following:

- Click on the Automations tab
- Click on the plus
- Choose either "Bluetooth" or "Carplay"
- Select "Is Disconnected" as the trigger (not connected), select the device (i.e. the cars bluetooth or Carplay name). Finally select "Run Immediately"

### Work Day, Auto Warm the Car If its cold

This automation will send a warm/cool command to the car, on a defined schedule (ie. 7am, on a weekday), based on if the outside temperature is above/below a given value. 

[Set EGMP Script](https://www.icloud.com/shortcuts/9e8eea220a724a5681845b6ad7310cc7)

[Get Status](https://www.icloud.com/shortcuts/d5a43ab5fa57449281dfb80e23db24f0)

[Auto Climate Control](https://www.icloud.com/shortcuts/8f715425cc0440519ede0dcfbb0f6fbb)

To setup the automation, perform the following:

- Click on the Automations tab
- Click on the plus
- Choose "Time of Day"
- Select the time you wish this automation to run, choose "Weekly" and select the days of the week you want it to run. Finally select "Run Immediately"


