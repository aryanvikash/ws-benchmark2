const http = require('http')
const { Server } = require('socket.io')

var os = require('os')

const client = new Map()


// Create an HTTP server
const server = http.createServer()
const io = new Server(server)

io.on('connection', (socket) => {
    // Generate a unique client ID
    const clientId = Math.random().toString(36).substring(7)
    socket.clientId = clientId
    // console.log('Client connected:', clientId)
    client.set(clientId, socket)
    socket.emit('message', 'Welcome! Your client ID is: ' + clientId)
    socket.on('message', (message) => {
        // console.log('Received: %s', message)
        // broadcast to all clients
        io.emit('message', message)
    })

    // Handle client disconnections
    socket.on('disconnect', () => {
        // console.log('Client disconnected:', socket.clientId)
        client.delete(socket.clientId)
    })
})

// Start the HTTP server
server.listen(8080, () => {
    console.log('Server listening on port 8080')
})

setInterval(() => {
    // const totalMem = os.totalmem()
    // const freeMem = os.freemem()
    // const usedMem = totalMem - freeMem
    // const memUsage = (usedMem / totalMem) * 100
    // // bytes to MB
    // console.log('Total Memory:', totalMem / 1024 / 1024, 'MB')
    // console.log('Memory Usages : ', memUsage / 1024 / 1024, 'MB')
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
