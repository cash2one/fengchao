var fs = require('fs')
var http = require('http')
var helper = require('./helpers/webhelper.js')
var checker = require('./clientCheckIP.js')

function search(){
    this.words=[];
    this.keywordFile = "words.3.txt";
    this.resultFile;
    this.cityCategory = 1;
    this.done={};
    this.logFile = "log/search.log";
}

search.prototype.init = function(){
    var startIdx,len,doneCount=0;

    var args = process.argv.slice(2);
    if(args.length>0){
	this.cityCategory = args[0];
    }
    if(args.length>1){
	this.keywordFile = args[1];
    }
    this.resultFile = "result/linkcount.txt."+this.keywordFile;
    if(args.length > 3){
	startIdx = args[2];
	len = args[3];
    }
    if(args.length >4){
	this.cookieIdx = args[4];
    }
    
    if(fs.existsSync(this.resultFile)){
	fs.readFileSync(this.resultFile).toString().split('\r\n').reduce(function(prev,cur){
	    var w = cur.split('|')[0];
	    prev[w]=true;
	    doneCount++;
	    return prev;
	},this.done);
    }
    
    if(fs.existsSync(this.keywordFile)){
	this.words = fs.readFileSync(this.keywordFile).toString().split('\n').filter(function(line,idx){
	    if(idx<startIdx || idx>=len)
		return false;
	    if(!line||line=='\r'||line=='\n'){
		return false;
	    }
	    var w = line.replace('\r','').replace('\n','').split(",")[0];
	    if(that.done[w])
		return false;
	    return true;
	}).map(function(line){
	    return line.replace('\r','').split(",")[0];
	});
	
	//this.words = this.words.slice(startIdx,len);
	
	var msg = "done keywords: "+doneCount+",total keywords: " +this.words.length;
	console.log(msg);
	fs.appendFile(this.logFile,msg+"\n",function(){});
    }
}
//http://www.baidu.com/s?tn=89040009_4_pg&ie=utf-8&bs=%E9%B2%9C%E8%8A%B1&f=8&rsv_bp=1&rsv_spt=3&wd=%E9%B2%9C%E8%8A%B1
search.prototype.wget = function(){
    if(!this.words.length){
	var msg = "job done.";
	console.log(msg);
	fs.appendFile(this.logFile,msg+"\n",function(){});
	return;
    }
    var word = null;
    do{
	word = this.words.shift();
    }while(this.done[word] && this.words.length);
    
    var encoded = encodeURIComponent(word);
    var query = {ie:'utf-8',bs:encoded,wd:encoded};
    //var query = {wd:encoded};
    var opt  =new helper.basic_options('www.baidu.com','/s','GET',false,true,query);
    opt.headers['referer']='http://www.baidu.com';
    opt.headers['is_xhr'] = 1;
    opt.headers['is_referer'] = "http://www.baidu.com/s?wd=%E6%90%AC%E5%AE%B6%E5%85%AC%E5%8F%B8&rsv_spt=1&issp=1&f=8&rsv_bp=0&ie=utf-8&tn=92734721_hao_pg&rsv_enter=0&rsv_sug3=13&rsv_sug4=758&rsv_sug1=14&rsv_sug2=0&inputT=4456&rsv_sug=1&bs=%E6%90%AC%E5%AE%B6%E5%85%AC%E5%8F%B8";
    var cookies = ["BDUSS=ZOb28yUjUtelNMUzJPYVlxOHpiOXpMSkE4elRjRENCbHJzOX4tSEtQb2FIZ0JVQVFBQUFBJCQAAAAAAAAAAAEAAAAfhRYFbWlrZTQ0MjE0NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqR2FMakdhTLT; _ga=GA1.2.1548832101.1409724017; BAIDUID=14625C86523B9B3517C82F7A22242126:FG=1; BAIDUPSID=14625C86523B9B3517C82F7A22242126; BDRCVFR[RUlzQHq_p-D]=abEqiLbLeMnnWckTLR8mvqV; BD_HOME=1; BD_UPN=123145; H_PS_BDC=1; H_PS_BABANNER=4; H_PS_645EC=5268vUjzON8NRX%2Ft0aLU8Ql2Onig9YYuxXC%2FnlIesYmjgi0b9eMlmb1AuSPkyY0GZLJOV%2FF0; BD_CK_SAM=1; BDSVRTM=57; H_PS_PSSID=9328_1452_9144_8593_7825_7799_7963_9193_8973_9051_9024_9171; WWW_ST=1413806533332","BDUSS=ZOb28yUjUtelNMUzJPYVlxOHpiOXpMSkE4elRjRENCbHJzOX4tSEtQb2FIZ0JVQVFBQUFBJCQAAAAAAAAAAAEAAAAfhRYFbWlrZTQ0MjE0NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABqR2FMakdhTLT; _ga=GA1.2.1548832101.1409724017; BAIDUID=14625C86523B9B3517C82F7A22242126:FG=1; BAIDUPSID=14625C86523B9B3517C82F7A22242126; H_PS_BABANNER=5; BD_HOME=1; BD_UPN=123145; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; H_PS_BDC=1; BD_CK_SAM=1; H_PS_PSSID=8868_1452_9181_7802_9144_6505_6017_8593_7825_7799_7963_9193_8973_9051_9024_9189; H_PS_645EC=998b1XqayshojEoUHEeBhsnqy9qoxlbrlPYk8m3fSfppSq%2BlspKdLPAwzaW0EQhM1Grj; WWW_ST=1413990070412","BAIDUID=78756232D043C5B5DF957F19113523BF:FG=1; BAIDUPSID=78756232D043C5B5DF957F19113523BF; BD_HOME=0; BD_UPN=1232; H_PS_645EC=3159Yq1bSKACgkuM9nacWI7fIAFuT6kJs32V43irAQFaY3zC4tIbrhdRQEQ; BD_CK_SAM=1; BDSVRTM=28; H_PS_PSSID=8867_9008_1445_7800_9143_6504_6017_8592_7826_7798_9454_7962_9192_8973_9024_9188","AIDUID=751D6D11DA96038DB5EAD527E4CA345B:FG=1; H_PS_PSSID=9184_9363_1451_7801_9144_6505_6017_8593_7826_7798_9454_7962_9193_8973_9023_9189; BD_UPN=1332; H_PS_645EC=e116MvmallMxcerBcAmc3%2Fa6y2Wu%2B7kN%2FOy535MA43RwTduKWWQQ%2FkkS5F0; BD_CK_SAM=1; BAIDUPSID=751D6D11DA96038DB5EAD527E4CA345B; BD_HOME=0; BDSVRTM=60"];
    opt.headers['Cookie'] = cookies[this.cookieIdx||0];
    opt.agent = false;
    //console.log(opt);
    helper.request_data(opt,null,function(data,args){
	that.process(data,args);
    },word);
}

search.prototype.process = function(data,args){
    if(!data){
	console.log("data empty");
	fs.appendFile(this.logFile,"data empty\n",function(){});
	var waitTime=0;
	if(args[args.length-1]=="redirect"){
	    waitTime=1000000;
	}
	setTimeout(function(){
	    that.wget();
	},waitTime);
	return;
    }
    var rightAdCount,adLinkCount,isInBlock=0;
    //var cnt = fs.readFileSync('baidu.tabled.html').toString();
    fs.appendFileSync("log/"+args[0]+".html",data);
    var m = data.match(/bdfs\d/g);
    rightAdCount = m && m.length/2 || 0;
    m = data.match(/>推广</g);
    adLinkCount = m && m.length || 0;
    
    if(!adLinkCount){
	m = data.match(/<table.*?<\/table>(?=<br\/>)/g);
	var r = m && m[0];
	adLinkCount = r && r.match(/<table.*?<\/table>/g).length || 0;
	isInBlock = adLinkCount>0?1:0;
    }
    msg = [args[0],adLinkCount,rightAdCount];
    console.log(msg.join());
    fs.appendFile(this.logFile,msg.join()+"\n",function(){});
    
    this.append(args[0],adLinkCount,rightAdCount,isInBlock);
    setTimeout(function(){
	that.wget();
    },8000);
}

search.prototype.append = function(word,adLinkCount,rightAdCount,isInBlock){
    var result = [word,adLinkCount,isInBlock,rightAdCount,this.cityCategory,'\r\n'];
    this.done[word]=true;
    fs.appendFile(this.resultFile,result.join("|"));
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
