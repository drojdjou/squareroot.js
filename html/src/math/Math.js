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