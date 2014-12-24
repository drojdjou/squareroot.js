// shader.glsl
//#vertex
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uViewMatrix;
uniform mat4 uMatrix;
uniform mat4 uProjection;

varying vec2 vUV;

void main() {
	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
uniform sampler2D uTexture;

varying vec2 vUV;

void main() {
	gl_FragColor = texture2D(uTexture, vUV);
}