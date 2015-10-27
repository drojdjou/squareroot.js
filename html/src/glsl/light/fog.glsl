//#name fog
uniform vec2 uFog;
uniform vec3 uFogColor;

vec3 fog(vec3 c) {
	float f = (gl_FragCoord.z / gl_FragCoord.w - uFog.x) / (uFog.y - uFog.x);
	f = clamp(f, 0.0, 1.0);
	return mix(c, uFogColor, f);
}

float fogDepth() {
	return (gl_FragCoord.z / gl_FragCoord.w - uFog.x) / (uFog.y - uFog.x);
}