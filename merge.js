var fs = require('fs')

var files = ['linkcount.1.1.txt','linkcount.1.2.txt','linkcount.1.3.txt',
	     'linkcount.2.1.txt','linkcount.2.2.txt','linkcount.2.3.txt'
	    ];
var words = [];
var allWords = {};
fs.readFileSync("words.txt").toString().split('\n').forEach(function(line){
    if(!line || line=='\r'){
	return;
    }
    allWords[line.replace('\r','')]="";
//    words[line]="";
//    console.log(line);
});

for(var i=0;i<files.length;i++){
    words[i] = {};
    if(!fs.existsSync("result/"+files[i]))
	continue;

    fs.readFileSync('result/'+files[i]).toString().split('\n').forEach(function(line){
	if(!line || line=='\r'){
	    return;
	}
	line = line.replace('\r','');
	var idx = line.match(/,/).index;
	
	var w = line.slice(0,idx);
	var j = i+1;
	
	words[i][w] = line.slice(idx+1);
    });
}
for(var i=0;i<words.length;i++){
    for(var k in words[i]){
	allWords[k]+=words[i][k];
    }
}
for(var k in allWords){
    fs.appendFileSync('result/lc.txt',k+','+allWords[k]+"\n");
    //console.log(allWords[k]);
}
