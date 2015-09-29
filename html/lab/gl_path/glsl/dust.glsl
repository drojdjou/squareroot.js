// line.glsl
//#vertex
attribute vec3 aPosition;
attribute vec3 aDirection;
attribute float aCycle;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
uniform float uTime;
uniform float uPointSize;

varying float vCycle;

void main() {
	vCycle = sin(uTime / 1000.0 + aCycle);
	vec3 p = aPosition + aDirection * uTime;
	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
	gl_PointSize = uPointSize;
}

//#fragment
precision highp float;

uniform vec3 uColor;

varying float vCycle;

void main() {
	gl_FragColor = vec4(uColor, vCycle);
}