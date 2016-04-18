/*
The MIT License (MIT)
Copyright (c) 2015 Jayr Alencar
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// requeries
var	fs = require('fs');
var path = require('path');

/**
* class basel - basel-cli
* to access basel directives in BASEL apps
*/
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

/**
   * dabase
   *
   * @type {Object}
 */
basel.prototype.database = null;

/**
   * config
   *
   * @type {Object}
 */
basel.prototype.config = null;

/**
   * Menu
   *
   * @return {Object} - Menu list
 */
basel.prototype.menu = function() {
	return this.database.run("SELECT route, name FROM crud WHERE show_menu = 1 AND ativo = 1");
};

/**
   * Routes
   *
   * @return {Object} - Routes to AngularJS
 */
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

