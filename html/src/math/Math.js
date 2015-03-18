Math.clamp = function(v, s, e) {
	if(v <= s) return s;
	if(v >= e) return e;
	return v;
}

Math.clamp01 = function(v) {
	if(v <= 0) return 0;
	if(v >= 1) return 1;
	return v;
}

Math.getBoundsAtDistance = function(fov, distance, width, height) {
	width = width || window.innerWidth;
	height = height || window.innerHeight;
	var aspect = width/height;
	var t = Math.tan(fov / 180 * Math.PI / 2);
	var h = distance * t;
	var w = h * aspect;
	return { w : w, h : h };
};