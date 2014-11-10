var Key = (function() {

	var k = {};

	k.SPACE = " ";

	var ck = 0;

	document.addEventListener('keydown', function(e) {
		ck = e.keyCode;
	});

	document.addEventListener('keyup', function(e) {
		ck = 0;
	});

	k.down = function(key, callback) {
		document.addEventListener('keydown', function(e) {
			if(e.keyCode == key.charCodeAt(0)) callback();
		});
	}

	k.up = function(key, callback) {

	}

	k.isDown = function(key) {
		var kd = (ck == key.charCodeAt(0));
		return kd;
	}

	return k;

})();