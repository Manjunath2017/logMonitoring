const app = require('express')();
const http=require('http');
const server=http.createServer(app);


const socket=require('socket.io');
const io=socket(server);

const exec = require('child_process').exec;
const fs=require('fs');
const fileName = "logger.txt";


require('./writelogs').writeLogs();

app.get('/', (request, response)=>{
    response.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket)=>{
    console.log('socket connected!');
    fs.open(fileName, 'r', (err)=> { 
        // console.log(socket);

        exec("tail " + fileName, (err, tailLogs) => { //tailLogs is the content of file 
        //this will execute only once(1st time)
            tailLogs = tailLogs.replace(new RegExp('\n','g'), '<br />');  //replace --> \n to <br /> --> 'g' global replace all matches cases at once
            if(!tailLogs){
                tailLogs = "<h3>Log File Empty</h3>"; //display if file is empty
            }
        // emit throws the message to client or browser
            socket.emit('logsSync', { message: tailLogs });
        });

        //after every update in file 'watch' will triger
        fs.watch(fileName, (event)=>{
// console.log(event);
            if(event === "change") { 
                //google execute shell script
                exec("tail " + fileName, (err, tailLogs) => {
                    tailLogs = tailLogs.replace(new RegExp('\n','g'), '<br />'); //replace --> \n to <br /> --> 'g' global replace all matches cases at once
                    if(!tailLogs){
                        tailLogs = "<h3>Log File Empty</h3>";
                    }
                socket.emit('logsSync', { message: tailLogs });
                });
            }
        });
    });



});

const port=process.env.PORT || 8080;
server.listen(port,() => {
    console.log(`Server running at port ${port}`);
});

// newrelic
