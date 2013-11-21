var VirtualScroll = (function(document) {

	var vs = {};

	var numListeners, listeners = [], initialized = false;

	var touchStartX, touchStartY, touchMult = 2;
	var mozMult = -8;
	var webkitMult = 0.25;
	var ieMult = 1;

	vs.whichListener = [];

	var event = {
		y: 0,
		x: 0,
		deltaX: 0,
		deltaY: 0
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

	var wheelFunc = function(e, dy, dx) {
		event.y += dy;
		event.deltaY = dy;

		if(dx) {
			event.x += dx;
			event.deltaX = dx;
		}

		notify();
	}

	var onWheel = function(e) {

		//
		if(vs.whichListener.indexOf("wheel") == -1) vs.whichListener.push("wheel");
		//

		wheelFunc(e, (e.wheelDeltaY || e.wheelDelta) * ieMult);		
	}

	var onWebkitWheel = function(e) {

		//
		if(vs.whichListener.indexOf("mousewheel") == -1) vs.whichListener.push("mousewheel");
		//

		wheelFunc(e, (e.wheelDeltaY || e.wheelDelta) * webkitMult);		
	}

	var onMozWheel = function(e) {

		//
		if(vs.whichListener.indexOf("domscroll") == -1) vs.whichListener.push("domscroll");
		//

		wheelFunc(e, e.detail * mozMult);		
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
			(t0.pageY - touchStartY) * touchMult,
			(t0.pageX - touchStartX) * touchMult
		);

		touchStartX = t0.pageX;
		touchStartY = t0.pageY;
	}

	var initListeners = function() {
		document.addEventListener("wheel", onWheel);
		document.addEventListener("mousewheel", onWebkitWheel);
		document.addEventListener("DOMMouseScroll", onMozWheel);
		document.addEventListener("touchstart", onTouchStart);
		document.addEventListener("touchmove", onTouchMove);
		initialized = true;
	}

	var destroyListeners = function() {
		document.removeEventListener("wheel", onIEWheel);
		document.removeEventListener("mousewheel", onWebkitWheel);
		document.removeEventListener("DOMMouseScroll", onMozWheel);
		document.removeEventListener("touchstart", onTouchStart);
		document.removeEventListener("touchmove", onTouchMove);
		initialized = false;
	}

	return vs;
})(document);





