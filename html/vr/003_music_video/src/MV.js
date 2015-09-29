var MV = {

	BUILD: 1,
	VR_DEBUG: true,

	STARTUP_EVENT: 'startup',

	createLibrary: function($) {

		var lib = {};
		var assets = [];
		lib.assetList = [];

		lib.scheduleLoad = function(path, name) {
			lib.assetList.push([path, name]);
		}

		lib.register = function(name, factory) {
			if(assets[name]) console.warn('Library: warning, duplicate asset name', name);
			assets[name] = factory;
		}

		lib.get = function(name) {
			if(assets[name]) return assets[name]();
			else console.error('Library: unknown asset', name);
		}
		
		return lib;

	},

	createTimeline: function($) {

		var t = {};

		t.timer = new Timer(false, true);
		t.events = {};

	
		var startTime = -1;
		var time = 0;

		t.deltaTime = 0;
		t.currentTime = $.data.config.start || 0;

		var scenes = [];
	

		t.addTrigger = function(name) {
			t.events[name] = new Trigger();
		}

		t.registerScene = function(inTime, outTime, updateFunc, manageFunc) {

			var duration = outTime - inTime;
			var wasIn = false;

			var localUpdateFunc = function() {
				var localTime = (t.currentTime - inTime) / duration;
				var isIn = localTime >= 0 && localTime <= 1;

				
				if(!wasIn && isIn) manageFunc(true);
				if(wasIn && !isIn) manageFunc(false);
				if(isIn) updateFunc(localTime);

				wasIn = isIn;
			}

			scenes.push(localUpdateFunc);
		}

		t.onUpdate = function() {
			if(startTime == -1) startTime = new Date().getTime();

			var now = (new Date().getTime() - startTime);
			t.deltaTime = now - time;

			if($.data.config.reverse) 
				t.currentTime -= t.deltaTime * $.data.config.timeScale;
			else
				t.currentTime += t.deltaTime * $.data.config.timeScale;

			for(var i = 0; i < scenes.length; i++) scenes[i]();

			time = now;

			if($.data.config.repeat > 0) {
				var r = $.data.config.repeat;
				if(t.currentTime > r) t.currentTime -= r;
				if(t.currentTime < 0) t.currentTime += r;
			}

			// console.log(t.currentTime);
		}

		t.start = function() {
			t.events[MV.STARTUP_EVENT].trigger();
			t.timer.start();
		}

		return t;

	}
};