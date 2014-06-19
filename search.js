var fs = require('fs')
var http = require('http')
var helper = require('./helpers/webhelper.js')
var checker = require('./clientCheckIP.js')

function search(){
    this.words=[];
    this.keywordFile = "words.txt";
    this.resultFile = "result/linkcount.txt";
    this.cityCategory = 1;
    this.done={};
}

search.prototype.init = function(){
    if(fs.existsSync(this.resultFile)){
	fs.readFileSync(this.resultFile).toString().split('\r\n').reduce(function(prev,cur){
	    prev[cur.split(',')[0]]=true;
	    return prev;
	},this.done);
    }
    if(fs.existsSync(this.keywordFile)){
	this.words = fs.readFileSync(this.keywordFile).toString().split('\n').filter(function(line){
	    if(!line||line=='\r'||line=='\n'){
		return false;
	    }
	    var w = line.replace('\r','').replace('\n','');
	    return !that.done[w];
	});
	console.log("total keywords: %d",this.words.length);
	
	var args = process.argv.slice(2);
	if(args.length>0){
	    this.cityCategory = args[0];
	}
    }
}
//http://www.baidu.com/s?tn=89040009_4_pg&ie=utf-8&bs=%E9%B2%9C%E8%8A%B1&f=8&rsv_bp=1&rsv_spt=3&wd=%E9%B2%9C%E8%8A%B1
search.prototype.wget = function(){
    if(!this.words.length){
	console.log("job done.");
	return;
    }
    var word = null;
    do{
	word = this.words.shift();
    }while(this.done[word]);
    
    var encoded = encodeURIComponent(word);
    var query = {ie:'utf-8',bs:encoded,wd:encoded};
    
    var opt  =new helper.basic_options('www.baidu.com','/s','GET',false,false,query);
    opt.headers['referer']='http://www.baidu.com';
//    opt.agent = new http.Agent();
//    opt.agent.maxSocket = 1;
    helper.request_data(opt,null,function(data,args){
	that.process(data,args);
    },word);
}

search.prototype.process = function(data,args){
    if(!data){
	console.log("data empty");
	setTimeout(function(){
	    that.wget();
	},20000);
	return;
    }
    var rightAdCount,adLinkCount,isInBlock=0;
    //var cnt = fs.readFileSync('baidu.tabled.html').toString();
    var m = data.match(/bdfs\d/g);
    rightAdCount = m && m.length/2 || 0;
    
    console.log("advertises of right: %s",rightAdCount);
    
    m = data.match(/>推广</g);
    adLinkCount = m && m.length || 0;
    
    if(!adLinkCount){
	m = data.match(/<table.*?<\/table>(?=<br\/>)/g);
	var r = m && m[0];
	adLinkCount = r && r.match(/<table.*?<\/table>/g).length || 0;
	isInBlock = adLinkCount>0?1:0;
	console.log("advertises os list(with bg): %d",adLinkCount);
    }else{
	console.log("advertises of list: %s",adLinkCount);
    }
    this.append(args[0],adLinkCount,rightAdCount,isInBlock);
    setTimeout(function(){
	that.wget();
    },20000);
}

search.prototype.append = function(word,adLinkCount,rightAdCount,isInBlock){
    var result = [word,adLinkCount,isInBlock,rightAdCount,this.cityCategory,'\r\n'];
    this.done[word]=true;
    fs.appendFile(this.resultFile,result.join());
}

search.prototype.start = function(){
    this.init();
//    this.words.push("投资");
    this.wget();
}

var instance = new search();
var that = instance;
//setInterval(function(){
//    checker.CheckerClient.start();
//},50000);

instance.start();
