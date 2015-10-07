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

Math.absMin = function(a, b) {
	if(a <= -b || a >= b) return a;
	else if(a >= 0) return b;
	else return -b;
}

Math.map = function(v, s, e) {
	if(v <= s) return 0;
	if(v >= e) return 1;
	return (v - s) / (e - s);
}