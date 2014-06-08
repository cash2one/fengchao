var http = require('http')
var fs = require('fs')
var helper = require('./helpers/webhelper.js')


function CheckerClient(){
    this.proxyItems = [];
}

CheckerClient.prototype.start = function(){
    this.init();
    this.check(this.proxyItems[0]);
    //this.proxyItems.forEach(that.check);
}

CheckerClient.prototype.init = function(){
    this.proxyItems = fs.readFileSync("ip.txt").toString().split('\n');
    console.log("total proxys: %d",this.proxyItems.length);
}

CheckerClient.prototype.check = function(line){
    if(!line) return;
    var vals = line.split('#');
    console.log("proxy: %s,city: %s",vals[0],vals[1]);
    var city = vals[1];
    var proxy = vals[0].split(':');
    
    var ip = proxy[0];
    var port = proxy[1];
    
    var opt = new helper.basic_options(ip,'/107.170.197.198:8081','GET',false,false,{t:'101.228.231.196'},port);
    helper.request_data(opt,null,function(data,args){
	that.process(data,args);
    },line);
}

CheckerClient.prototype.process = function(data,args){
    if(data && data.trim()=="true"){
	console.log(args[0]);
	fs.appendFileSync("v.txt",args[0]+'\r\n');
    }
    else{
	console.log("unavaliable");
    }
}
var instance = new CheckerClient();
var that = instance;
instance.start();
