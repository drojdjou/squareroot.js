// line.glsl
//#vertex
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform float uPointSize;

void main() {
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = uPointSize;
}

//#fragment
precision highp float;

uniform vec3 uColor;

void main() {
	gl_FragColor = vec4(uColor, 1.0);
}