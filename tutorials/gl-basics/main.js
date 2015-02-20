var Presentation = function() {

	var slides = Array.prototype.slice.call(document.querySelectorAll('article'));
	var slideNum = document.querySelector('footer span');
	var currentSlide = parseInt(location.search.substring(1)) || 0;
	var maxSlide = slides.length - 1;
	var currentSlideElement;

	slides.forEach(function(e) {

		var iframe = e.querySelector('iframe');
		if(iframe) {
			e.demo = (function() {

				var frame = iframe;
				var url = iframe.getAttribute('data-src');

				return {
					start: function() {
						frame.src = url;
					},

					stop: function() {
						frame.src = "";
					}
				}

			})();
		}

	});

	var setSlide = function(c) {

		if(currentSlideElement) {
			var e = currentSlideElement;
			e.style.display = 'none';
			if(e.demo) e.demo.stop();
		}

		slides.forEach(function(e, i) {
			if(i == c) {
				currentSlideElement = e;
				e.style.display = 'block';
				if(e.demo) e.demo.start();
			}
		});

		slideNum.innerHTML = c;

	};

	setSlide(currentSlide);

	// left arrow: 37 up arrow: 38 right arrow: 39 down arrow: 40
	document.addEventListener('keydown', function(e) {

		e.preventDefault();
		console.log('keydown', e.keyCode);

		if(e.keyCode == 32 || e.keyCode == 39) {
			currentSlide++;
		}

		if(e.keyCode == 37) {
			currentSlide--;
		}

		if(currentSlide < 0) currentSlide = 0;
		if(currentSlide > maxSlide) currentSlide = maxSlide;

		setSlide(currentSlide);
	});

}