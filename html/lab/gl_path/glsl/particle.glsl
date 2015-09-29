// line.glsl
//#vertex
attribute vec3 aPosition;
attribute float aCycle;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform float uPointSize;

varying float vCycle;

void main() {
	vCycle = aCycle;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = uPointSize * vCycle;
}

//#fragment
precision highp float;

uniform sampler2D uTexture;

varying float vCycle;

void main() {
	vec4 c = texture2D(uTexture, gl_PointCoord);
	gl_FragColor = vec4(c.rgb, c.a * vCycle * 0.5);
}