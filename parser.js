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

// Stop words for names.
var stop_words = new Array(
        'a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'i',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'like',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'point',
        'pointed',
        'pointing',
        'points',
        'possible',
        'present',
        'presented',
        'presenting',
        'presents',
        'problem',
        'problems',
        'put',
        'puts',
        'q',
        'quite',
        'r',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'small',
        'smaller',
        'smallest',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'thought',
        'thoughts',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'u',
        'under',
        'until',
        'up',
        'upon',
        'us',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'working',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yet',
        'you',
        'young',
        'younger',
        'youngest',
        'your',
        'yours',
        'z'
    )


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
	for (var i = 0; i < names.length; i++)
		names[i] = String(i);
	return names;
}

function getNameMap(text) {
	var storyNames = {};
	var freqs = frequencies(text);
	var size = 0;
	var stopwords = $.get('/stopwords.txt',
							function(result) {
							    if (result == 'ON') {
							        alert('ON');
							    } else if (result == 'OFF') {
							        alert('OFF');
							    } else {
							        alert(result);
							    }
							}
					);
	console.log(stopwords);
	for (name in freqs)
		if (true) {
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
	var map = getNameMap(text);
	for (name in map)
		text = text.replace(map, map[name]);
	return text;
}

function parse(str){
	var time1 = Date.now();
	start = str.indexOf('role="main"');
	realstrt = str.indexOf('>', start);
	end = str.indexOf('</div>', start);
	str = str.substring(realstrt+1,end);
	console.log(frequencies(str));
	console.log(getNameMap(str));
	str = replaceNames(str);
	console.log(Date.now() - time1);
	return str;
}
