// jquery.xdomainajax.js  ------ from padolsey

$.ajax = (function(_ajax){
	var protocol = location.protocol,
		hostname = location.hostname,
		exRegex = RegExp(protocol + '//' + hostname),
		YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
		query = 'select * from html where url="{URL}" and xpath="*"';

	function isExternal(url) {
		return !exRegex.test(url) && /:\/\//.test(url);
	}

	return function(o) {
		var url = o.url;

		if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {

			// Manipulate options so that JSONP-x request is made to YQL

			o.url = YQL;
			o.dataType = 'json';

			o.data = {
				q: query.replace(
					'{URL}',
					url + (o.data ?
						(/\?/.test(url) ? '&' : '?') + $.param(o.data)
					: '')
				),
				format: 'xml'
			};

			// Since it's a JSONP request
			// complete === success
			if (!o.success && o.complete) {
				o.success = o.complete;
				delete o.complete;
			}

			o.success = (function(_success){
				return function(data) {
					if (_success) {
						// Fake XHR callback.
						_success.call(this, {
							responseText: data.results[0]
								// YQL screws with <script>s
								// Get rid of them
								.replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
						}, 'success');
					}
				};
			})(o.success);
		}

		return _ajax.apply(this, arguments);
	};
})($.ajax);

$.ajax({
	url: your_url,
	type: 'GET',
	success: function(res) {
		var text = res.responseText;
		// console.log(text);
		text = parse(text);
		$("#story").html(text);
		// then you can manipulate your text as you wish
	}
});

function frequencies(text) {
	var words = text.split(new RegExp(" |<|>", 'g'));
	var separator = ".";
	var punctuation = [",", ".", "?", "!"]
	var honorifics = ["Mr.", "Ms.", "Mrs.", "Dr.", "Mister", "Miss", "Missus"]
	var frequencies = {};
	var lastChar = function(word) {
		return word[word.length - 1];
	}
	var isCapital = function(word) {
		return "A" <= word[0] && word[0] <= "Z";
	}
	var extricate = function(word) {
		string = "";

		// Get rid of apostrophes
		if (string.split("'").length != 1 && string.split("'")[1].length < 3)
			string = string.split("'")[0];

		for (var i = 0; i < word.length; i++)
			if (!(word[i] in punctuation) &&
				'a' <= word[i].toLowerCase() &&
				word[i].toLowerCase() <= 'z' ||
				word[i] == "'")
				string += word[i];
				
		return string;
	}

	for (var i = 0; i < words.length; i++){
		// Obtain the capital phrase if extant
		if (isCapital(words[i])) {
			// Get name from words list.
			name = "";
			while (i < words.length
				&& isCapital(words[i])
				&& !(lastChar(words[i]) in punctuation))
				name += " " + extricate(words[i++]);

			// Add name to frequencies dictionary
			if ([name, separator] in frequencies)
				frequencies[[name, separator]] = frequencies[[name, separator]] + 1;
			else
				frequencies[[name, separator]] = 1;
		}

		if (words[i] != null && lastChar(words[i]) in punctuation)
			separator = lastChar(words[i]);
		else
			separator = " ";
	}
	return frequencies;
}

function getFriendNames(number) {
	var names = new Array(number);
	for (var i; i < names.length; i++) {

	}
}

function getNameMap(text) {
	var storyNames = {};
	var freqs = frequencies(text);
	var size = 0;
	for (name in freqs)
		if (freqs[name] > 1) {
			storyNames[name] = null;
			size++;
		}

	var friendNames = getFriendNames(freqs.length);
	var index = 0;
	for (name in storyNames)
		storyNames[name] = friendNames[index++];

	return storyNames;
}

function replaceNames(text) {
	for (name in getNameMap(text).keys())
		text.replace(map, map[name]);
}

function parse(str){
	var time1 = Date.now();
	start = str.indexOf('role="main"');
	realstrt = str.indexOf('>', start);
	end = str.indexOf('</div>', start);
	str = str.substring(realstrt+1,end);
	console.log(frequencies(str));
	// str = replaceNames(str);
	console.log(Date.now() - time1);
	return str;
}
