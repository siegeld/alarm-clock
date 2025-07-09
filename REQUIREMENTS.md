Requirements for the project:

We are building an alarm clock integration for Home Assistant. This alarm clock is a Home Assistant
device that supports:

- Setting the alarm time
- A snooze function
- Ability to turn alarm on and off
- Day of week functionality
- Pre alarm function, setting a number of minutes before the alarm time and invoke a script
  to do pre-wakeup events, like turning on the lights (optional).
- Run a script when alarm triggers.
- Run a script after a certain number of minutes after the alarm triggers (optional) to
  end alarm (for example turn off music).

* Write code in python
* Make this stand alone, though it can use other entities as is customary in integrations.
* I want this to be loadable by the community via HACS.
* I will want you to build a lovelace widget. Include this in the directory under a folder
* called ui. The widget should look nice and allow controlling all the entities that
* makeup the clock. Make sure you have a config flow as well, so you can setup the ui from
* the gui. Make sure the ui lets you set the various scripts (reference scripts that are
* defined, no need to specify scripts in the gui).
