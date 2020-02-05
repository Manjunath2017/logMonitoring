const fs=require('fs');
const ws=fs.createWriteStream('logger.txt', {flags:"a"});
const randomString=require('randomstring');
let counter=0;

module.exports={
    writeLogs:()=>{
        setInterval(()=>{
            ws.write(JSON.stringify({log_number:counter++, name:"Manjunath", log_time:new Date(), log_msg:randomString.generate({length:20, charset:'alphanumeric'})}) +"\n");
        }, 5000);
    }
}