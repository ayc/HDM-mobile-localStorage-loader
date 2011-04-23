/*
 * HDM mobile localStorage loader
 *
 *  Copyright (c) 2011 achoi@hearst.com
 *  
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *  
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 *
 *  https://github.com/ayc/HDM-mobile-localStorage-loader 
 */


(function () {
    function addcss(data) {
		addnodes(data,"STYLE");
    }
    function addscript(data) {
		addnodes(data,"SCRIPT");
    }
	function addnodes(data,tag){
        var styleNode = document.createElement(tag);
        var head = document.getElementsByTagName("head")[0] || document.documentElement;
        styleNode.textContent = data;
        head.appendChild(styleNode);
	}
	
    function cKey(name, version) {
        var myarrayofSimilarKeys = [];
        var exactKey = null;
        var lsLength = localStorage.length;
        var i;
        for (i = 0; i < lsLength; i++) {
            var key = localStorage.key(i);
            if (name === key.split("#")[0]) {
                if ((name + "#" + version) === (key)) {
                    exactKey = key;
                } else {
                    myarrayofSimilarKeys.push(key);
                }
            }
        }
        for (i = 0; i < myarrayofSimilarKeys.length; i++) {
            localStorage.removeItem(myarrayofSimilarKeys[i]);
        }
        return exactKey;
    }
    function guri(type, callback) {
        var tagsarray = document.getElementsByTagName("meta");
        var returnarray = [];
        var i;
        for (i = 0; i < tagsarray.length; i++) {
            var name = tagsarray[i].getAttribute("name");
            if (!name) continue;
            var seeking = "localStorage:" + type;
            if (name.toUpperCase() === seeking.toUpperCase()) {
                var content = tagsarray[i].getAttribute("content").split("#");
                var url = content[0];
                var version = content[1];
                var mykey = cKey(url, version);
                if ( !! mykey) {
                    callback(localStorage.getItem(mykey));
                } else {
					var req = new XMLHttpRequest();
					req.open('GET', url, false);
					req.send(null);
					if (req.status === 200) {
						try {
							localStorage.setItem(url + "#" + version, data);
							callback(req.responseText);
						} catch (e) {
							throw ("[simpleget] execute failed! " + e + "\n\n" + callback);
						}
					}
                }
            }
        }
    }
    guri("javascript", addscript);
    guri("stylesheet", addcss);
}());