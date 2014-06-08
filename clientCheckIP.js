var http = require('http')
var fs = require('fs')
var helper = require('./helpers/webhelper.js')

var lines = fs.readFileSync("ip.txt").toString().split('\r\n');
lines.forEach(function(line){
    var vals = line.split(':');
    var ip = vals[0];
    var port = vals[1];
    var opt = new helper.basic_options(ip,'/107.170.197.198:1337','GET',false,false,{t:'101.228.231.196'},port);
    helper.request_data(opt,null,function(data,args){
	if(data && data.trim()=="true"){
	    fs.appendFileSync("v.txt",args[0]+'\r\n');
	}
    },line);
});

