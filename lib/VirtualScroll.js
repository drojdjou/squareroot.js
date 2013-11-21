/**

What listeners work on what platforms?

Chrome - wheel or mousewheel (if wheel is missing)
Safari - mousewheel
Firefox - both wheel and domscroll

*/

var VirtualScroll = (function(document) {

	var vs = {};

	var numListeners, listeners = [], initialized = false;

	var touchStartX, touchStartY;

	vs.whichListener = [];

	var hasWheelEvent = 'onwheel' in document;
	var hasMouseWheelEvent = 'onmousewheel' in document;
	var hasTouchStart = 'ontouchstart' in document;
	var hasTouchMove = 'ontouchmove' in document;

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

	var notify = function() {
		for(var i = 0; i < numListeners; i++) {
			listeners[i](event);
		}
	}

	var onWheel = function(e) {

		//
		if(vs.whichListener.indexOf("wheel") == -1) vs.whichListener.push("wheel");
		//

		// In Chrome and in Firefox (at least the new one)
		event.deltaX = e.wheelDeltaX || e.deltaX;
		event.deltaY = e.wheelDeltaY || e.deltaY;

		event.x += event.deltaX;
		event.y += event.deltaY;
		event.originalEvent = e;
		notify();
	}

	var onMouseWheel = function(e) {

		//
		if(vs.whichListener.indexOf("mousewheel") == -1) vs.whichListener.push("mousewheel");
		//

		// In Safari and in Chrome if 'wheel' isn't defined
		event.deltaX = e.wheelDeltaX;
		event.deltaY = e.wheelDeltaY;

		event.x += event.deltaX;
		event.y += event.deltaY;
		event.originalEvent = e;
		notify();	
	}

	var onTouchStart = function(e) {

		//
		if(vs.whichListener.indexOf("touchstart") == -1) vs.whichListener.push("touchstart");
		//

		// e.preventDefault();
		var t0 = e.targetTouches[0];
		touchStartX = t0.pageX;	
		touchStartY = t0.pageY;	
	}

	var onTouchMove = function(e) {

		//
		if(vs.whichListener.indexOf("touchmove") == -1) vs.whichListener.push("touchmove");
		//

		e.preventDefault();
		var t0 = e.targetTouches[0];

		wheelFunc(e, 
			(t0.pageY - touchStartY),
			(t0.pageX - touchStartX)
		);

		touchStartX = t0.pageX;
		touchStartY = t0.pageY;
	}

	var initListeners = function() {
		if(hasWheelEvent) document.addEventListener("wheel", onWheel);
		if(hasMouseWheelEvent) document.addEventListener("mousewheel", onMouseWheel);
		if(hasTouchStart) document.addEventListener("touchstart", onTouchStart);
		if(hasTouchMove) document.addEventListener("touchmove", onTouchMove);
		initialized = true;
	}

	var destroyListeners = function() {
		if(hasWheelEvent) document.removeEventListener("wheel", onWheel);
		if(hasMouseWheelEvent) document.removeEventListener("mousewheel", onMouseWheel);
		if(hasTouchStart) document.removeEventListener("touchstart", onTouchStart);
		if(hasTouchMove) document.removeEventListener("touchmove", onTouchMove);
		initialized = false;
	}

	return vs;
})(document);





