var fs = require('fs')
var http = require('http')
var helper = require('./helpers/webhelper.js')

function search(){
    this.words=[];
}
//http://www.baidu.com/s?tn=89040009_4_pg&ie=utf-8&bs=%E9%B2%9C%E8%8A%B1&f=8&rsv_bp=1&rsv_spt=3&wd=%E9%B2%9C%E8%8A%B1
search.prototype.wget = function(){
    if(!this.words.length){
	console.log("job done.");
	return;
    }
    var word = this.words.pop();
    var encoded = encodeURIComponent(word);
    var query = {ie:'utf-8',bs:encoded,wd:encoded};
    var opt  =new helper.basic_options('www.baidu.com','/s','GET',false,false,query);
    opt.headers['referer']='http://www.baidu.com';
    helper.request_data(opt,null,function(data,args){
	that.process(data,args);
    },word);
}

search.prototype.process = function(data,args){
    if(!data){
	console.log("data empty");
	return;
    }
    var rightAdCount,adLinkCount;
    //var cnt = fs.readFileSync('baidu.tabled.html').toString();
    var m = data.match(/bdfs\d/g);
    rightAdCount = m && m.length/2 || 0;

    console.log("advertises of right: %s",rightAdCount);

    m = data.match(/>推广</g);
    adLinkCount = m && m.length || 0;

    if(!adLinkCount){
	var r = data.match(/<table.*?<\/table>(?=<br\/>)/g)[0];
	console.log("advertises os list(with bg): %d",r.match(/<table.*?<\/table>/g).length);
    }else{
	console.log("advertises of list: %s",adLinkCount);
    }
}

search.prototype.start = function(){
    this.words.push("投资");
    this.wget();
}

var instance = new search();
var that = instance;
instance.start();
