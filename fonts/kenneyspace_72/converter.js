var fs = require('fs'),
	eyes = require('eyes'),
	xml2js = require('xml2js');

var parser = new xml2js.Parser({ explicitRoot: false, mergeAttrs: true, explicitArray: false });

parser.on('end', function(result) {
	result.char = result.chars.char;
	delete result.chars;

	var json = JSON.stringify(result);
	fs.writeFile(__dirname + "/output.json", json, function(err) {
    	if(err) {
        	console.log(err);
    	} else {
        	console.log("The file was saved!");
    	}
    });
});

fs.readFile(__dirname + '/font.xml', function(err, data) {
	parser.parseString(data);
});
