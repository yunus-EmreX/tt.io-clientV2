Advanced WebSocket Traffic Controller
Overview

The Advanced WebSocket Traffic Controller is a versatile userscript designed to provide robust control over WebSocket traffic on any web application. This script enables you to monitor, pause, throttle, and manipulate WebSocket communications. It is particularly useful for online games, allowing you to send specific game-related messages to enhance your gameplay experience.
Features

    Traffic Monitoring: Logs all incoming WebSocket traffic to the console.
    Pause/Resume Traffic: Pause and resume all WebSocket traffic with a simple keypress.
    Pause/Resume Incoming Traffic: Independently pause and resume only incoming WebSocket traffic.
    Throttle Traffic: Introduce a delay in sending WebSocket messages.
    Send Periodic Messages: Automatically send predefined messages at regular intervals.
    Send Custom Game Messages: Send specific game-related messages to manipulate game data, such as increasing score, speed, defense, and more.
    Close All Sockets: Instantly close all active WebSocket connections.

Usage

After installing the userscript, you can control WebSocket traffic and manipulate game data using the following key bindings:

    t: Close all WebSocket connections.
    a: Toggle pause/resume all WebSocket traffic.
    b: Toggle pause/resume incoming WebSocket traffic.
    ı: Toggle start/stop throttling WebSocket messages.
    0: Toggle start/stop sending periodic messages.
    p: Send a message to increase the player's score.
    s: Send a message to increase the player's speed.
    d: Send a message to increase the player's defense.
    m: Send a message to slow down enemies.
    f: Send a message to increase the player's firepower.

Installation

    Install a userscript manager like Tampermonkey or Greasemonkey.
    Create a new userscript and paste the following code:

##This Code It gets support from many different codes and checks the connection based on what you follow.

    Save the script and it will start running on all websites you visit.

Contribution

Feel free to fork this project and contribute by submitting pull requests. If you find any issues or have feature requests, please open an issue on the GitHub repository.
License

This project is licensed under the MIT License. See the LICENSE file for details.
