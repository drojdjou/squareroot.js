//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aCarParam;

uniform mat4 uConcatMatrix;

varying float vLightBightness;

void main() {
	vLightBightness = 0.1 + aCarParam.x * 0.9;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 5.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec3 uNightColor;
uniform vec3 uDayColor;
uniform float uDayTime;

varying float vLightBightness;

void main() {
	// float b = mix(1.0, vLightBightness, uDayTime);
	// gl_FragColor = vec4(mix(uDayColor, uNightColor, uDayTime) * b, 1.0);
	gl_FragColor = vec4(mix(uDayColor, uNightColor, uDayTime), 1.0);
}