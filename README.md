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

javascript

// ==UserScript==
// @name         Advanced WebSocket Traffic Controller
// @namespace    http://your.namespace.com
// @version      0.1
// @description  Control WebSocket traffic and manipulate game data with specific keys
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let sockets = [];
    let originalWebSocket = window.WebSocket;
    let trafficPaused = false;
    let incomingPaused = false;
    let throttling = false;
    let sendingInterval = null;

    function logTraffic(data) {
        console.log('WebSocket traffic:', data);
    }

    function closeAllSockets() {
        sockets.forEach(socket => {
            socket.close();
        });
        sockets = [];
    }

    function pauseAllTraffic() {
        trafficPaused = true;
    }

    function resumeAllTraffic() {
        trafficPaused = false;
    }

    function pauseIncomingTraffic() {
        incomingPaused = true;
    }

    function resumeIncomingTraffic() {
        incomingPaused = false;
    }

    function startThrottling() {
        throttling = true;
    }

    function stopThrottling() {
        throttling = false;
    }

    function startSendingMessages() {
        sendingInterval = setInterval(() => {
            sockets.forEach(socket => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send('Triggered message');
                }
            });
        }, 1000); // Send message every second
    }

    function stopSendingMessages() {
        clearInterval(sendingInterval);
    }

    function sendGameMessage(message) {
        sockets.forEach(socket => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(message);
            }
        });
    }

    window.WebSocket = function(url, protocols) {
        let socket = new originalWebSocket(url, protocols);
        sockets.push(socket);

        socket.addEventListener('message', function(event) {
            if (trafficPaused || incomingPaused) {
                return;
            }
            logTraffic(event.data);
        });

        let originalSend = socket.send;
        socket.send = function(data) {
            if (trafficPaused) {
                return;
            }
            if (throttling) {
                setTimeout(() => {
                    originalSend.call(socket, data);
                }, 500); // Delay sending by 500ms
            } else {
                originalSend.call(socket, data);
            }
        };

        socket.addEventListener('close', function() {
            sockets = sockets.filter(s => s !== socket);
        });

        return socket;
    };

    // Add event listener for key press
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 't':
                closeAllSockets();
                break;
            case 'a':
                if (trafficPaused) {
                    resumeAllTraffic();
                } else {
                    pauseAllTraffic();
                }
                break;
            case 'b':
                if (incomingPaused) {
                    resumeIncomingTraffic();
                } else {
                    pauseIncomingTraffic();
                }
                break;
            case 'ı':
                if (throttling) {
                    stopThrottling();
                } else {
                    startThrottling();
                }
                break;
            case '0':
                if (sendingInterval) {
                    stopSendingMessages();
                } else {
                    startSendingMessages();
                }
                break;
            case 'p':
                sendGameMessage('increase_score');
                break;
            case 's':
                sendGameMessage('increase_speed');
                break;
            case 'd':
                sendGameMessage('increase_defense');
                break;
            case 'm':
                sendGameMessage('slow_down_enemies');
                break;
            case 'f':
                sendGameMessage('increase_firepower');
                break;
        }
    });
})();

    Save the script and it will start running on all websites you visit.

Contribution

Feel free to fork this project and contribute by submitting pull requests. If you find any issues or have feature requests, please open an issue on the GitHub repository.
License

This project is licensed under the MIT License. See the LICENSE file for details.
