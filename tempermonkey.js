// ==UserScript==
// @name         Advanced WebSocket Traffic Controller
// @namespace    http://your.namespace.com
// @version      0.1
// @description  Control WebSocket traffic and manipulate game data with specific keys
// @author       ShellBee
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
                sendGameMessage('increase_score'); // Increase player's instece
                break;
            case 's':
                sendGameMessage('increase_speed'); // Increase player's land
                break;
            case 'd':
                sendGameMessage('increase_defense'); // Increase player's defense
                break;
            case 'm':
                sendGameMessage('slow_down_enemies'); // Slow down all bots
                break;
            case 'f':
                sendGameMessage('increase_firepower'); // outeplay mode
                break;
        }
    });
})();
