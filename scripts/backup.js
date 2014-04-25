
var AdmZip = require('adm-zip'),
	fs = require('fs')
	path = require('path');
	
var done = function(dir) {
  console.info('Project backup created at '+dir);
  console.info('=============================================');
}

module.exports.builder = function(name, kwargs){
	
	var existsSync = fs.existsSync || path.existsSync;
	var outputDir = existsSync(name)? name :process.cwd()+'\\..\\';
	
	var zip = new AdmZip();
	zip.addLocalFolder(process.cwd());
	zip.writeZip(outputDir+'backup.zip');
	done(outputDir);
}