var http=require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res){
    var addr = req.socket.remoteAddress;
    console.log("remote addr:%s",addr);
    var ano = false;
    var t = url.parse(req.url,true).query.t;
    console.log("expected addr:%s",t);
    if(addr == t){
	ano=false;
    }
    
    res.writeHead(200);
    res.end(ano+'\n');
}).listen(8081,'0.0.0.0');
console.log("Server running at http://127.0.0.1:8081");
