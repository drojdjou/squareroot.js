// line.glsl
//#vertex
attribute vec3 aPosition;
attribute float aOffset;
attribute float aOrder;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform float uPointSize;
uniform float uTime;
uniform float uAngle;

varying float vOrder;

void main() {
	vOrder = 1.0 - aOrder;
	float nx = cos(uAngle + uTime / 1000.0);
	float ny = sin(uAngle + uTime / 1000.0);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition + vec3(nx, ny, 0.0) * aOffset * aOrder, 1.0);
	gl_PointSize = uPointSize;
}

//#fragment
precision highp float;

uniform vec3 uColor;

varying float vOrder;

void main() {
	gl_FragColor = vec4(uColor * vOrder, 1.0);
}