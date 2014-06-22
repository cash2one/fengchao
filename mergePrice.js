var fs = require('fs')

words = {};

var priceFile = "result/price.txt";

fs.readFileSync(priceFile).toString().split('\n').forEach(function(line){
    line = line.replace("\r",'');
    if(!line)
	return;
    var vals = line.split(",");
    var idx = line.match(/,/).index;
    var w = vals[0];
    var price = vals[5];
    var click = vals[6];
    words[w] = line;
});

fs.readFileSync("words.2.txt").toString().split('\n').forEach(function(line){
    if(!line || line=='\r')
	return;
    line = line.replace('\r','');
    var w = line.split(',')[0];
    fs.appendFileSync("result/merged.price.txt",words[w]+'\n');
});