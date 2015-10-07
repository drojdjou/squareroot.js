uniform float uNear;
uniform float uFar;

float fog() {
	return (gl_FragCoord.z / gl_FragCoord.w - uNear) / (uFar - uNear);
}