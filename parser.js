
// jquery.xdomainajax.js  ------ from padolsey

jQuery.ajax = (function(_ajax){

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
						(/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
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

})(jQuery.ajax);

var names = [];

function frequencies(text) {
	var words = text.split(" ");
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
		if (lastChar(word) in punctuation)
			return word.substring(0, word.length - 1);
	}

	for (var i = 0; i < words.length; i++){
		// Obtain the capital phrase if extant
		if (isCapital(words[i])) {
			// Get name from words list.
			name = "";
			while (i < words.length && isCapital(words[i]))
				name += " " + words[i++]

			// Add name to frequencies dictionary
			if ([name, separator] in frequencies)
				frequencies[[name, separator]]++;
			else
				frequencies[[name, separator]] = 1;
		}

		if (words[i] != null && lastChar(words[i]) in punctuation)
			separator = lastChar(words[i]);
		else
			separator = " ";
	}
	console.log(frequencies);
	return frequencies;
}

function findnames(text) {

}

function parse(str){
	start = str.indexOf('role="main"');
	realstrt = str.indexOf('>', start);
	end = str.indexOf('</div>', start);
	str = str.substring(realstrt+1,end);
	frequencies(str);
	// str = findnames(str);
	// console.log(end);
	return str;
}

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
