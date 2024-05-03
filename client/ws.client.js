// var W3CWebSocket = require('websocket').w3cwebsocket;

// function test(){
//     var client = new W3CWebSocket('ws://localhost:8080/', 'echo-protocol');

// client.onerror = function() {
//     console.log('Connection Error');
// };

// client.onopen = function() {
//     console.log('WebSocket Client Connected');

//     function sendNumber() {
//         if (client.readyState === client.OPEN) {
//             var number = Math.round(Math.random() * 0xFFFFFF);
//             client.send(number.toString());
//             setTimeout(sendNumber, 1000);
//         }
//     }
//     sendNumber();
// };

// client.onclose = function() {
//     console.log('echo-protocol Client Closed');
// };

// client.onmessage = function(e) {
//     if (typeof e.data === 'string') {
//         console.log("Received: '" + e.data + "'");
//     }
// };
// }

// for ( var i = 1; i <= 10000; i++ ) {
//     test()
// }

// // for ( var i = 1; i <= 10000; i++ ) {
// //     test()
// // }


/* eslint-disable no-await-in-loop,no-console */
const WebSocket = require('ws');

let connected = 0;
let connectionTime = 0;
let failed = 0;

const wsUrl = 'ws://localhost:8080';

const totalRun = 100000;
const concurrency = 2000;

const connectws = async () => {
  const startTime = Date.now();
  const ws = new WebSocket(wsUrl);
  try {
    await new Promise((resolve, reject) => {
      ws.once('open', () => resolve());
      ws.once('error', () => reject());
    });
    connectionTime = Date.now() - startTime;
    connected += 1;
  } catch (err) {
    failed += 1;
  }
};

const runConcurrent = async (count, fn) => {
  await Promise.all(
    Array(count)
      .fill(0)
      .map(() => fn())
  );
};

const delay = (ms) =>
  new Promise((r) => {
    setTimeout(r, ms);
  });

const benchmark = async () => {
  const brk = false;
  while (!brk) {
    await runConcurrent(concurrency, connectws);
    console.log(
      `connected -> ${connected} : failed -> ${failed} : connectionTime: ${connectionTime} : avgConnectionTime -> ${
        connectionTime / (connected + failed)
      }ms`
    );
    if (failed + connected >= totalRun) break;
    await delay(1000);
  }
};

benchmark().then();
