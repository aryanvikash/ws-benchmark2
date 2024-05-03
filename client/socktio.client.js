/* eslint-disable no-await-in-loop,no-console */
const io = require('socket.io-client');

let connected = 0;
let connectionTime = 0;
let failed = 0;

const socketIoUrl = 'http://localhost:8080';

const totalRun = 100000;
const concurrency = 2000;

const connectws = async () => {
  const startTime = Date.now();
  const socket = io(socketIoUrl, { autoConnect: false });
  socket.connect();
  try {
    await new Promise((resolve, reject) => {
      socket.once('connect', () => resolve());
      socket.once('error', () => reject());
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

