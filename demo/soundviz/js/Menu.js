var Menu = (function() {

	var width = 240;

	var effectCallback, micCallback, trackCallback;

	var menu = document.querySelector(".menu");
	var btn = document.querySelector(".menu-button");
	var close = document.querySelector(".menu .close");
	var effects = document.querySelectorAll(".effects li");

	var mic = document.querySelector(".mic");
	var track = document.querySelector(".track");

	var translateX = function(e, v) {
		e.style.webkitTransform = 'translateX(' + v + 'px)';
		e.style.msTransform = 'translateX(' + v + 'px)';
		e.style.MozTransform = 'translateX(' + v + 'px)';
		e.style.transform = 'translateX(' + v + 'px)';
	}

	for(var i = 0; i < effects.length; i++) {
		var e = effects[i];
		e.addEventListener('click', function(event) {
			var et = event.target;
			var index = parseInt(et.getAttribute('data-index'));

			for(var j = 0; j < effects.length; j++) {
				var oe = effects[j];
				if(et == oe) oe.setAttribute('class', 'selected');
				else oe.setAttribute('class', '');

				if(effectCallback) effectCallback(index);
			}
		});
	}

	btn.addEventListener('click', function() {
		btn.style.opacity = 0;
		menu.style.opacity = 1;
		translateX(menu, 0);

		setTimeout(function() {
			btn.style.display = 'none';
		}, 200);
	});

	close.addEventListener('click', function() {
		btn.style.display = 'block';

		setTimeout(function() {
			btn.style.opacity = 1;
		}, 1);

		menu.style.opacity = 0;
		translateX(menu, -30);
	});

	mic.addEventListener('click', function() {
		mic.setAttribute('class', 'selected');
		track.setAttribute('class', '');
		if(micCallback) micCallback();
	});

	track.addEventListener('click', function() {
		mic.setAttribute('class', '');
		track.setAttribute('class', 'selected');
		if(trackCallback) trackCallback();
	});

	var m = {};

	m.onEffect = function(callback) {
		effectCallback = callback;
	}

	m.onMic = function(callback) {	
		micCallback = callback;
		
	}

	m.onTrack = function(callback) {
		trackCallback = callback;
		
	}

	track.setAttribute('class', 'selected');
	effects[0].setAttribute('class', 'selected');
	btn.style.opacity = 0;
	btn.style.display = 'none';

	return m;

})();










