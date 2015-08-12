// normal2color.glsl
//#vertex
attribute vec2 aPosition;
attribute float aAlpha;

varying float vAlpha;

uniform float uTime;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;

void main() {
	vAlpha = aAlpha;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 0.0, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;
uniform float uTime;

varying float vAlpha;

void main() {
	gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * 0.5);
}






