const app = require('express')();
const http=require('http');
const server=http.createServer(app);


const socket=require('socket.io');
const io=socket(server);

require('./writelogs').writeLogs();

app.get('/', (request, response)=>{
    response.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket)=>{
    console.log('socket connected!');
});

const port=process.env.PORT || 8080;
server.listen(port,() => {
    console.log(`Server running at port ${port}`);
});

// newrelic
