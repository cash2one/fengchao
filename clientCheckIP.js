var http = require('http')
var fs = require('fs')
var helper = require('./helpers/webhelper.js')


function CheckerClient(){
    this.proxyItems = [];
    this.doneCount = 0;
    this.verified = [];
}

CheckerClient.prototype.start = function(){
    this.init();
    this.proxyItems.forEach(that.check);
}

CheckerClient.prototype.init = function(){
    this.proxyItems = fs.readFileSync("ip.txt").toString().split('\n');
    console.log("total proxys: %d",this.proxyItems.length);
}

CheckerClient.prototype.check = function(line){
    if(!line) return;
    var vals = line.split('#');
    //console.log("proxy: %s,city: %s",vals[0],vals[1]);
    var city = vals[1];
    var proxy = vals[0].split(':');
    
    var ip = proxy[0];
    var port = proxy[1];
    //http://www.baidu.com/
    var opt = new helper.basic_options(ip,'http://107.170.197.198:8081/','GET',false,false,{t:'101.228.231.196'},port);
    
    helper.request_data(opt,null,function(data,args){
	that.process(data,args);
    },line);
}

CheckerClient.prototype.process = function(data,args){
    this.doneCount++;
    if(data && data.trim()=="true"){
	this.verified.push(args[0]);
	console.log(args[0]);
    }
    else{
	console.log("unavaliable");
    }
    console.log("verified:%d,total:%d,avaliable:%d",this.doneCount,this.proxyItems.length,this.verified.length);
    if(this.doneCount == this.proxyItems.length){
	this.flushToFile();
    }
}

CheckerClient.prototype.flushToFile = function(){
    if(fs.existsSync('v.txt')){
	fs.unlinkSync('v.txt');
	console.log("file removed.");
    }
    var result = this.verified.join('\r\n');
    fs.appendFileSync("v.txt",result);
    console.log("new proxy flushed.");
}

var instance = new CheckerClient();
var that = instance;
instance.start();
