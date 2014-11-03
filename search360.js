var fs = require("fs");
var helper = require("./helpers/webhelper.js");
var cheerio = require("cheerio");

 var search360 = function(){
     this.resultDir = "result/";
     this.resultFile = "linkcount.360.txt";
     this.keywordFile = "5755.txt";
     this.done = {};
 }

 search360.prototype.init = function(){
     var arguments = process.argv.splice(2);
     var start = Number(arguments[0]||0);
     var len = Number(arguments[1]||this.words.length);
     
     if(fs.existsSync(this.resultDir+this.resultFile)){
	 fs.readFileSync(this.resultDir+this.resultFile).toString().split("\r\n").reduce(function(prev,cur){
	     prev[cur.split(',')[0]]=true;
	     return prev;
	 },this.done);
     }
     if(fs.existsSync(this.keywordFile)){
	 this.words = fs.readFileSync(this.keywordFile).toString().split("\n").filter(function(line,idx){
	     if(idx<start || start+len<=idx){
		 return false;
	     }
	     if(!line||line=='\r'||line=='\n'){
		 return false;
	     }
	     var w = line.replace('\r','').replace('\n','').split(',')[0];
	     return !that.done[w];
	 }).map(function(line){
	     return line.replace('\r','').split(',')[0];
	 });
     }

     //this.words = this.words.slice(start,start+len);
     console.log("total keywords: %d",this.words.length);
 }

 search360.prototype.start = function(){
     this.init();
     this.wget();
 }

 search360.prototype.wget = function(){
     if(this.words.length==0){
	 console.log("job done");
	 return;
     }
     var word = null;
     do{
	 word = this.words.shift();
     }while(this.done[word] && this.words.length);

     var encoded = encodeURIComponent(word);
     var query = {src:"srp",fr:"know_side_nlp",q:encoded,pq:encoded,psid:"06adde55e7af04e908ccb45d9168e444"};
     
     var opt  =new helper.basic_options('www.so.com','/s','GET',false,false,query);
     console.log("[GET ] %s",word);
     helper.request_data(opt,null,function(data,args){
	 that.process(data,args);
     },word);
 }

search360.prototype.process = function(data,args,res){
    if(!data){
	console.log("data empty");
	setTimeout(function(){
	    that.wget();
	},2000);
	return;
    }
    if(data.indexOf("360搜索_访问异常出错")>-1){
	console.log("请输入验证码, %s",res.url);
	return;
    }
    var $ = cheerio.load(data);
    var leftCount = $("#m-spread-left ul li").length;
    var rightCount = $("#rightbox li").length;
    var result = [args[0],leftCount,rightCount,"\r\n"];
    fs.appendFile(this.resultDir+this.resultFile,result.join());
    console.log("[DATA] %s,%s,%s",args[0],leftCount,rightCount);
    setTimeout(function(){
	that.wget();
    },200);
}

var instance = new search360();
var that = instance;
instance.start();
