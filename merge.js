var fs = require('fs')

var files = ['linkcount.1.1.txt','linkcount.1.2.txt','linkcount.1.3.txt',
	     'linkcount.2.1.txt','linkcount.2.2.txt','linkcount.2.3.txt'
	    ];
var words = {};
fs.readFileSync("words.txt").toString().split('\n').forEach(function(line){
    if(!line || line=='\r'){
	return;
    }
    words[line]={};
    
});

for(var i=0;i<files.length;i++){
    if(!fs.existsSync("result/"+files[i]))
	continue;
    fs.readFileSync('result/'+files[i]).toString().split('\n').forEach(function(line){
	if(!line || line=='\r'){
	    return;
	}
	var idx = line.match(/,/).index;
	var w = line.slice(0,idx);
	var j = i+1;
	words[w] += line.slice(idx+1);
	//if(j<=3){
	//    words[w]['1.'+j]=line.slice(idx+1);
	//}else{
	//    words[w]['2.'+(j%3)]=line.slice(idx+1);
	//}
    });
}
for(var k in words){
    console.log(k+','+words[k]+'\n');
    //fs.appendFileSync('result/lc.txt',k+','+words[k]+"\n");
}