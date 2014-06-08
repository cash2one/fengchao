var http=require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res){
    var addr = req.socket.remoteAddress;
    var result = '';
    console.log("remote addr:%s",addr);
    var t = url.parse(req.url,true).query.t;
    console.log("expected addr:%s",t);
    if(!addr || !t){
	result = "args null";
    }
    else if(addr.trim() == t.trim()){
	result = "false";
    }else{
	result = 'true';
    }
    
    res.writeHead(200);
    res.end(result+'\n');
}).listen(8081,'0.0.0.0');
console.log("Server running at http://127.0.0.1:8081");
