/**

V 1.97

Tested and works:

Safari iOS7
Chrome Mac and Win
Firefox Mac and Win
Safari Mac
Chrome Android
IE9, IE10
IE10 (?) Windows Mobile

Tested and doesn't work:

IE8

Not tested:

IE11 (should work same as IE10 but without vendor prefixes)

*/

var VirtualScroll = (function(document) {

	var vs = {};

	var numListeners, listeners = [], initialized = false;

	var touchStartX, touchStartY;

	// How many pixels to move with each key press
	var keyStep = 120;
	var bodyTouchAction;

	var hasWheelEvent = 'onwheel' in document;
	var hasMouseWheelEvent = 'onmousewheel' in document;
	var hasTouch = 'ontouchstart' in document;
	var hasPointer = !!window.navigator.msPointerEnabled;
	var hasKeyDown = 'onkeydown' in document;

	var event = {
		y: 0,
		x: 0,
		deltaX: 0,
		deltaY: 0,
		originalEvent: null
	};

	vs.addEventListener = function(f) {
		if(!initialized) initListeners(); 
		listeners.push(f);
		numListeners = listeners.length;
	}

	vs.removeEventListener = function(f) {
		listeners.splice(f, 1);
		numListeners = listeners.length;
		if(numListeners <= 0) destroyListeners();
	}

	var notify = function(e) {
		event.x += event.deltaX;
		event.y += event.deltaY;
		event.originalEvent = e;

		for(var i = 0; i < numListeners; i++) {
			listeners[i](event);
		}
	}

	var onWheel = function(e) {
		// In Chrome and in Firefox (at least the new one)
		event.deltaX = e.wheelDeltaX || e.deltaX * -1;
		event.deltaY = e.wheelDeltaY || e.deltaY * -1;

		notify(e);
	}

	var onMouseWheel = function(e) {
		// In Safari, IE and in Chrome if 'wheel' isn't defined
		event.deltaX = (e.wheelDeltaX) ? e.wheelDeltaX : 0;
		event.deltaY = (e.wheelDeltaY) ? e.wheelDeltaY : e.wheelDelta;

		notify(e);	
	}

	var onTouchStart = function(e) {
		var t = (e.targetTouches) ? e.targetTouches[0] : e;
		touchStartX = t.pageX;	
		touchStartY = t.pageY;
	}

	var onTouchMove = function(e) {
		// e.preventDefault(); // < This needs to be managed externally
		var t = (e.targetTouches) ? e.targetTouches[0] : e;

		event.deltaX = t.pageX - touchStartX;
		event.deltaY = t.pageY - touchStartY;
		
		touchStartX = t.pageX;
		touchStartY = t.pageY;

		notify(e);
	}

	var onKeyDown = function(e) {
		// 37 left arrow, 38 up arrow, 39 right arrow, 40 down arrow
		event.deltaX = event.deltaY = 0;
		switch(e.keyCode) {
			case 37:
				event.deltaX = -keyStep;
				break;
			case 39:
				event.deltaX = keyStep;
				break;
			case 38:
				event.deltaY = -keyStep;
				break;
			case 40:
				event.deltaY = keyStep;
				break;
		}

		notify(e);
	}

	var initListeners = function() {
		if(hasWheelEvent) document.addEventListener("wheel", onWheel);
		if(hasMouseWheelEvent) document.addEventListener("mousewheel", onMouseWheel);

		if(hasTouch) {
			document.addEventListener("touchstart", onTouchStart);
			document.addEventListener("touchmove", onTouchMove);
		}
		
		if(hasPointer) {
			bodyTouchAction = document.body.style.msTouchAction;
			document.body.style.msTouchAction = "none";
			document.addEventListener("MSPointerDown", onTouchStart, true);
			document.addEventListener("MSPointerMove", onTouchMove, true);
		}

		if(hasKeyDown) document.addEventListener("keydown", onKeyDown);

		initialized = true;
	}

	var destroyListeners = function() {
		if(hasWheelEvent) document.removeEventListener("wheel", onWheel);
		if(hasMouseWheelEvent) document.removeEventListener("mousewheel", onMouseWheel);

		if(hasTouch) {
			document.removeEventListener("touchstart", onTouchStart);
			document.removeEventListener("touchmove", onTouchMove);
		}
		
		if(hasPointer) {
			document.body.style.msTouchAction = bodyTouchAction;
			document.removeEventListener("MSPointerDown", onTouchStart, true);
			document.removeEventListener("MSPointerMove", onTouchMove, true);
		}

		if(hasKeyDown) document.removeEventListener("keydown", onKeyDown);

		initialized = false;
	}

	return vs;
})(document);





