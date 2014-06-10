var fs = require('fs')
var cheerio = require('cheerio')

var Seed = {
    "1.医疗健康":['医生在线咨询','症状','药','养生','健康','保健','医疗事故','医疗器械','医改','医院','养老','手术','医保'],
    "2.教育培训":['教育','培训','考研','MBA','在职','移民','留学','出国','签证','英语'],
    "3.电商":['团购','打折','买鞋','买衣服','买包','买电器','商城','淘宝'],
    "4.旅游喝礼品":['旅游','机票','礼品','酒店','旅馆'],
    "5.招商加盟":['加盟','代理','连锁','招商','小本创业','小本投资'],
    "6.机械加工":['机械加工'],
    "7.金融服务":['信用卡','保险','理财','网贷','投资'],
    "8.汽车行业":['汽配','汽车美容','SUV','租车'],
    "9.食品饮料":['食品批发','进口食品','饮料批发'],
    "10.游戏/IT":['热门游戏','游戏排行','OA','财务软件']
}
var Rule = {
    "1.医疗健康":{tail:5,head:10,both:4},
    "2.教育培训":{tail:3,head:5,both:1},
    "3.电商":{tail:3,head:5,both:2},
    "4.旅游喝礼品":{tail:3,head:10,both:2},
    "5.招商加盟":{tail:3,head:8,both:2},
    "6.机械加工":{tail:5,head:55,both:0},
    "7.金融服务":{tail:3,head:8,both:2},
    "8.汽车行业":{tail:2,head:5,both:1},
    "9.食品饮料":{tail:3,head:5,both:2},
    "10.游戏/IT":{tail:4,head:8,both:2}
}
for(var k in Seed){
    var seedWords = Seed[k];
    seedWords.forEach(function(seedWord){
	if(!fs.existsSync("result/htmlTargetWords/"+seedWord+'.html')){
	    return;
	}
	console.log(seedWord);
	var data = fs.readFileSync("result/htmlTargetWords/"+seedWord+'.html').toString();
	var $ = cheerio.load(data);
	var targets = [];
	$("table tr.table-row").each(function(idx,row){
	    var t = {};
	    t.w = $('span.word',row).text();
	    var str = $('td.table-td div.table-tbody-cell',row).eq(2).text();
	    if(!isNaN(Number(str))){
		t.s = Number(str);
	    }else{
		t.s = 0;
	    }
	    targets.push(t);
	});
	console.log("total target words:%d",targets.length);
	var rule = Rule[k];
	var result=targets.slice(0,rule.head-1).map(function(t){return t.w;});
	result = result.concat(targets.slice(targets.length-rule.tail).map(function(t){return t.w;}));
	var filtered = targets.filter(function(t){return t.s>=5});
	console.log("day of search count >5:%d",filtered.length);
	var mid = Math.floor(filtered.length-1/2);
	result.push(filtered[mid].w);
	result.concat(filtered.slice(0,rule.both-1).map(function(t){return t.w;}));
	result.concat(filtered.slice(filtered.length-rule.both).map(function(t){return t.w;}));
	fs.appendFileSync("words.txt",result.join('\n')+"\n\n");
    });

    
}

