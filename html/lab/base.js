CodeColor = {
	reComment: /.*(\/\/.*)/,
	reKeyword: /(function|var|document|window)/g,
	reString: /("[^"]*")/g,
	reOperator: /[^a-zA-Z0-9](if|for|return|switch|case|while)[^a-zA-Z0-9]/g,
	reSymbol: /\s=|\s\*|\s\+|\s-|\s\/\s/g,
	reObject: /true|false|Date/,
	reStringBack: /%%(.)%%/g,
	reFunction: /[\s|\.]([_a-zA-Z0-9]*)\(/g,
	reFunction2: /[\s|\.]([_a-zA-Z0-9]*) = function/g
};

CodeColor.wrap = function(content, type) {
	return '<span class="' + type + '">' + content + '</span>';
}

CodeColor.wrapString = function(content, type, tempArray) {
	tempArray.push('<span class="' + type + '">' + content + '</span>');
	return "%%" + (tempArray.length - 1) + "%%";
}

CodeColor.colorize = function(query) {
	var codeBlocks = document.querySelectorAll(query);
	var numCodeBlocks = codeBlocks.length;
	var stringTempArray = []

	console.log(numCodeBlocks + " code blocks found for " + query);

	for(var i = 0; i < numCodeBlocks; i++) {
		var code = codeBlocks[i].innerHTML.split("\n");
		var numLines = code.length, result = "";

		stringTempArray.length = 0;

		for(var j = 0; j < numLines; j++) {

			code[j] = code[j].replace(CodeColor.reString, function(match) {
				return CodeColor.wrapString(match, 'string', stringTempArray);
			});

			code[j] = code[j].replace(CodeColor.reFunction2, function(match, m1) {
				return match.replace(m1, CodeColor.wrap(m1, 'func'));
			});

			code[j] = code[j].replace(CodeColor.reFunction, function(match, m1) {
				return match.replace(m1, CodeColor.wrap(m1, 'func'));
			});

			code[j] = code[j].replace(CodeColor.reOperator, function(match, m1) {
				return match.replace(m1, CodeColor.wrap(m1, 'operator'));
			});

			code[j] = code[j].replace(CodeColor.reSymbol, function(match, m1) {
				return CodeColor.wrap(match, 'operator');
			});

			code[j] = code[j].replace(CodeColor.reComment, function(match) {
				return CodeColor.wrap(match, 'comment');
			});

			code[j] = code[j].replace(CodeColor.reKeyword, function(match) {
				return CodeColor.wrap(match, 'keyword');
			});

			code[j] = code[j].replace(CodeColor.reObject, function(match) {
				return CodeColor.wrap(match, 'object');
			});

			

			code[j] = code[j].replace(CodeColor.reStringBack, function(match, m1) {
				return stringTempArray[parseInt(m1)];
			});
		}
		
		codeBlocks[i].innerHTML = code.join("\n");
	}
}

var article = document.querySelector('header article');
var button = document.querySelector('header button');
var code = document.querySelector('header article code');
var src = document.querySelector('#gl-script')

var articleVisible = false;

button.addEventListener('click', function(e) {
	articleVisible = !articleVisible;
	article.style.display = articleVisible ? 'block' : 'none';
	if(window.innerWidth > 1024) {
		code.innerHTML = src.innerHTML;
		CodeColor.colorize("code");
	} else {
		code.innerHTML = "";
	}
});