var fs = require('fs')
var cheerio = require('cheerio')

var obj = JSON.parse(fs.readFileSync('t').toString());
for(var i=0;i<obj.data.length;i++){
    var indObj = obj.data[i];
    indObj.seeds.forEach(function(seedWord){
	if(!fs.existsSync("result/htmlTargetWords/"+seedWord+'.html')){
	    return;
	}
	console.log(seedWord);
	var data = fs.readFileSync("result/htmlTargetWords/"+seedWord+'.html').toString();

	var $ = cheerio.load(data);
	var targets = [];
	$("table tr.table-row").each(function(idx,row){
	    var t = {};
	    t.w = $('span.word',this).attr('title');
	    var str = $('td.table-td div.table-tbody-cell',this).eq(2).text();
	    if(!isNaN(Number(str))){
		t.s = Number(str);
	    }else{
		t.s = 0;
	    }
	    targets.push(t);
	});
	targets.sort(function(a,b){return b.s-a.s;});
	var rule = indObj.rule;
	var result=targets.slice(0,rule.head).map(function(t,i){
	    return t.w+','+indObj.ind+','+seedWord+',前'+rule.head+','+i;
	});

	result = result.concat(targets.slice(targets.length-rule.tail).map(function(t,i){
	    return t.w+','+indObj.ind+','+seedWord+',后'+rule.tail+','+i;
	}));
	var filtered = targets.filter(function(t){
	    return t.s>=5
	});
	console.log("day of search count >5:%d",filtered.length);
	var mid = Math.floor(filtered.length-1/2);
	result.push(filtered[mid].w+','+indObj.ind+','+seedWord+',中位数'+',0');
	result = result.concat(filtered.slice(0,rule.both).map(function(t,i){
	    return t.w+','+indObj.ind+','+seedWord+',前'+rule.both+','+i;
	}));
	result = result.concat(filtered.slice(filtered.length-rule.both).map(function(t,i){
	    return t.w+','+indObj.ind+','+seedWord+',后'+rule.both+','+i;
	}));
	fs.appendFileSync("words.2.txt",result.join('\n')+"\n\n");
    });
}
