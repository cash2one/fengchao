var fs = require('fs')
var words = {};

var files = ['linkcount.1.1.txt','linkcount.1.2.txt','linkcount.1.3.txt',
	     'linkcount.2.1.txt','linkcount.2.2.txt','linkcount.2.3.txt'
	    ];
files.forEach(function(fileName){
    if(fs.existsSync('result/'+fileName)){
	fs.readFileSync("result/"+fileName).toString().split('\n').forEach(function(line){
	    if(!line || line=='\r')
		return;
	    line = line.replace('\r','');
	    var w = line.split(',')[0];
	    var idx=  line.match(/,/).index;
	    var data = line.slice(idx);
	    words[w] = data;
	});
	fs.readFileSync("words.2.txt").toString().split('\n').forEach(function(line){
	    if(!line || line=='\r')
		return;
	    line = line.replace('\r','');
	    var w = line.split(',')[0];
	    fs.appendFileSync("result/"+fileName.replace("linkcount","merged"),line+words[w]+"\r\n");
	});
	words = {};
    }
});
