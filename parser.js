// jquery.xdomainajax.js  ------ from padolsey
var counter = 0;
var notFound = true;
var urls = ['https://www.fanfiction.net/book/Harry-Potter/?&srt=4&g1=3&lan=1&r=4&len=11&s=2',
           'https://www.fanfiction.net/book/Lord-of-the-Rings/?&srt=4&g1=3&lan=1&r=4&len=11&s=2',
            'https://www.fanfiction.net/book/Gossip-Girl/?&srt=4&g1=3&lan=1&r=4&len=11&s=2', 'https://www.fanfiction.net/book/Twilight/?&srt=4&g1=3&lan=1&r=4&len=11&s=2',
            'https://www.fanfiction.net/movie/Avengers/?&srt=4&g1=3&lan=1&r=4&len=11&s=2',
            'https://www.fanfiction.net/movie/High-School-Musical/?&srt=4&g1=3&lan=1&r=4&len=11&s=2',
            'https://www.fanfiction.net/anime/Fullmetal-Alchemist/?&srt=4&g1=3&lan=1&r=4&len=11&s=2',
            'https://www.fanfiction.net/anime/Sailor-Moon/?&srt=4&g1=3&lan=1&r=4&len=11&s=2',
            'https://www.fanfiction.net/movie/Frozen/?&srt=4&g1=3&lan=1&r=4&len=11&s=2']
var srhurlrand = Math.floor(Math.random()*10);
var searchurl = urls[srhurlrand];

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
var searchnum = Math.floor(Math.random()*25 + 1);
var ind;
var indend;
var strnum;
var storytext;
function getStoryURL(searchnum){
$.ajax({
    url: searchurl,
    type: 'GET',
    dataType: 'xml',

    success: function(res) {
        var srch = res.responseText;
        for(var i = 0; i < searchnum; i++){
            ind = srch.indexOf("/s/", ind);
        }
        indend = srch.indexOf('"', ind);
        var strnum = srch.substring(ind, indend);
        console.log(strnum);
        your_url = 'https://www.fanfiction.net' + strnum;
        console.log(your_url);

        $.ajax({
	   url: your_url,
	   type: 'GET',
	   success: function(res) {
		var text = res.responseText;
		// console.log(text);
		ret = parse(text);
    storytext = ret[0];

    var freqs = ret[1];
    len = freqs.length;
    addHTML = "";
    for(r = 0; r < len; r++){
      addHTML = addHTML + "<input data-version='" + r + "' class='names' name='nams' placeholder='Add Name " + (r+1) + "'>";
    }
    addHTML = addHTML + "<input type='submit' class='submitbutton'>";
    $(".names").html(addHTML);

    //inputs = ["Mounika","Mathew","Kai Zhan", "Fred", "Bob"];
    //str = swappero(str,freqs,inputs);

		//$("#story").html(text);
		// then you can manipulate your text as you wish
	}
});
        return strnum;    //$("#story").html(strnum);
    }
		// then you can manipulate your text as you wish
	});
}
getStoryURL(searchnum);




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

// This function
function getNames(number) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://api.culpa.info/gold_nuggets", false);

	xhr
}

function getNameMap(text) {
	var storyNames = {};
	var freqs = frequencies(text);
	var size = 0;

	for (name in freqs)
		if (true) {
			storyNames[name] = null;
			size++;
		}

	var friendNames = getNames(freqs.length);
	var index = 0;

	return storyNames;
}

function replaceNames(text) {
	var map = getNameMap(text);
	for (name in map)
		text = text.replace(map, map[name]);
	return text;
}

function topfreqs(obj){
  returnnames = [];
  for(var propertyName in obj) {
    if(obj[propertyName] > 2){
      propertyName = propertyName.replace(",","");//remove dem commas
      rg = new RegExp(" ","ig");
      propertyName = propertyName.replace(rg,"");//remove extraneous space
      if(stop_words.indexOf(propertyName.toLowerCase()) == -1){
        returnnames.unshift(propertyName);
      }
    }
  }

  return returnnames;
}

function swappero(str,freqs,inputs){
  console.log(freqs);
  final_freqs = [];
  for(k = 0; k < freqs.length; k++){
    for(w = k+1; w < freqs.length; w++){
      if(freqs[k].indexOf(freqs[w]) != -1){
        freqs = freqs.splice(w, 1);
      }
    }
  }
  for(qwe = 0; qwe < freqs.length && qwe < inputs.length; qwe++){
    rg = new RegExp(freqs[qwe],"ig");
    str = str.replace(rg,inputs[qwe]);
  }
  return str;
}


function parse(str){
	var time1 = Date.now();
	start = str.indexOf('role="main"');
	realstrt = str.indexOf('>', start);
	end = str.indexOf('</div>', start);
	str = str.substring(realstrt+1,end);
	freqs = topfreqs(frequencies(str));

	return [str,freqs];
}

$(document).ready(function(){
  $(".form").submit(function( event ) {
    event.preventDefault();
    var nams = $("input[name='nams']")
              .map(function(){return $(this).val();}).get();
    storytext = swappero(storytext,freqs,nams);
    $("#story").html(storytext);

  });


})
