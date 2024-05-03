const WebSocket = require('ws')
const os = require('os')
// Create a WebSocket server
const client = new Map()
const wss = new WebSocket.Server({ port: 8080 })

wss.on('connection', (ws) => {
    // Generate a unique client ID
    const clientId = Math.random().toString(36).substring(7)
    ws.clientId = clientId
    // console.log('Client connected:', clientId)
    client.set(clientId, ws)

    ws.send('Welcome! Your client ID is: ' + clientId)
    ws.on('error', (error) => {
        console.log('Error:')
    })
    ws.on('message', (message) => {
        // console.log('Received: %s', message)
    })

    // Handle client disconnections
    ws.on('close', () => {
        // console.log('Client disconnected:', ws.clientId)
        client.delete(ws.clientId)
    })
})

setInterval(() => {
    // const totalMem = os.totalmem()
    // const freeMem = os.freemem()
    // const usedMem = totalMem - freeMem
    // const memUsage = (usedMem / totalMem) * 100
    // console.log('Memory:', memUsage.toFixed(2) + '%')
    // console.log('CPU:', os.loadavg())

    const formatMemoryUsage = (data) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`

    const memoryData = process.memoryUsage()

    const memoryUsage = {
        rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
        heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
        heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
        external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
    }

    console.log(memoryUsage)

    console.log('Clients:', client.size)
}, 1000)
