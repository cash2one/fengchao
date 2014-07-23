var fs = require('fs')
var words={};

fs.readFileSync("result/linkcount.sogou.bak.txt").toString().split("\n").forEach(function(line){
    if(!line) return;
    words[line.split(',')[0]]=line;
});

fs.readFileSync("words.5k.txt").toString().split('\n').forEach(function(line){
    if(!line) return;
    var key = line.split(',')[0];
    console.log("%s,%s",line,words[key]&&words[key].replace(/\|/g,','));
});

