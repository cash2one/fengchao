var http=require('http')
var fs = require('fs')
var url = require('url')

http.createServer(function(req,res){
    var addr = req.socket.remoteAddress;
    console.log(addr);
    
    console.log('\n');
    var ano = false;
    if(addr === url.parse(req.url,true).query.t){
	ano=false;
    }
    
    res.writeHead(200);
    res.end(ano+'\n');
}).listen(1337,'127.0.0.1');
console.log("Server running at http://127.0.0.1:8081");
