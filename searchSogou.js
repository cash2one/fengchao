var fs = require("fs");
var helper = require("./helpers/webhelper.js");
var cheerio = require("cheerio");

var searchSogou = function(){
    this.resultDir = "result/";
    this.resultFile = "linkcount.sogou.txt";
    this.keywordFile = "5755.txt";
    this.done = {};
}

searchSogou.prototype.init = function(){
    var startIdx,len;
    var args = process.argv.slice(2);
    if(args.length>0){
	this.keywordFile = args[0];
    }
    if(args.length > 1){
	startIdx = Number(args[1]);
	len = Number(args[2]);
    }
    if(fs.existsSync(this.resultDir+this.resultFile)){
	fs.readFileSync(this.resultDir+this.resultFile).toString().split("\r\n").reduce(function(prev,cur){
	    prev[cur.split(',')[0]]=true;
	    return prev;
	},this.done);
    }
    if(fs.existsSync(this.keywordFile)){
	this.words = fs.readFileSync(this.keywordFile).toString().split("\n").filter(function(line,idx){
	    if(idx<startIdx || len+startIdx<=idx)
		return false;
	    if(!line||line=='\r'||line=='\n'){
		return false;
	    }
	    var w = line.replace('\r','').replace('\n','').split(',')[0];
	    return !that.done[w];
	}).map(function(line){
	    return line.replace('\r','').split(",")[0];
	});
    }
    
    console.log("total keywords: %d",this.words.length);
}

searchSogou.prototype.start = function(){
    this.init();
    this.wget();
}

searchSogou.prototype.wget = function(){
    if(this.words.length==0){
	console.log("job done");
	return;
    }
    var word = null;
    do{
	word = this.words.shift();
    }while(this.done[word] && this.words.length);
    
    var encoded = encodeURIComponent(word);
    var query = {query:encoded,ie:"utf8",_ast:1403943296,_asf:null,w:01029901,p:40040100,dp:1};
    
    var opt  =new helper.basic_options('www.sogou.com','/web','GET',false,false,query);
    opt.agent = false;
    helper.request_data(opt,null,function(data,args){
	that.process(data,args);
    },word);
}

searchSogou.prototype.process = function(data,args){
    if(!data){
	console.log("data empty");
	setTimeout(function(){
	    that.wget();
	},3000);
	return;
    }
    
    var $ = cheerio.load(data);
//    console.log($(".business").length);
//    if($('.business ol li').length==0 &&  $(".atTrunk .b_rb").length==0){
//	console.log("none results");
//    }
//    fs.writeFileSync("result/testPage.txt",data);
//    return;
    var leftCount = $('.business ol li').length || 0;
    var rightCount = $(".atTrunk .b_rb").length || 0;
    var result = [args[0],leftCount,rightCount,"\r\n"];
    fs.appendFile(this.resultDir+this.resultFile,result.join(","));
    console.log("%s,%s,%s",args[0],leftCount,rightCount);
    setTimeout(function(){
	that.wget();
    },30000);
}

var instance = new searchSogou();
var that = instance;
instance.start();
