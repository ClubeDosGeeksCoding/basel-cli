var	fs = require('fs');
var path = require('path');

function basel () {
	this.config = JSON.parse(fs.readFileSync(path.join(process.cwd(),'basel.json')));
	var databaseFile = (this.config.database.split('\\')).length == 1 ?  path.join(process.cwd(),'model',this.config.database+'.db') : this.config.database;
	if(this.config.cipher){
		var sqlite = require('sqlite-cipher');
		sqlite.connect(databaseFile, this.config.password,this.config.algorithm);
		this.database = sqlite;
	}else{
		var sqlite = require('sqlite-sync');
		sqlite.connect(databaseFile);
		this.database = sqlite;
	}
}

basel.prototype.database = null;
basel.prototype.config = null;

basel.prototype.menu = function() {
	return this.database.run("SELECT route, name FROM crud WHERE show_menu = 1 AND ativo = 1");
};

basel.prototype.routes = function(){
	var res = this.database.run("SELECT * FROM crud WHERE ativo = 1");
	var ret = [];
	for(i in res){
		ret.push({
			when: '/'+res[i].route,
			data:{
				controller: res[i].controller,
				templateUrl: 'views/'+res[i].view,
				isFree: true
			}
		});
	}
	return ret;
}

// Exporting module
module.exports = new basel();

