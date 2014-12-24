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
uniform vec2 uSize;
uniform float uFrame;

varying vec2 vUV;

void main() {
	vec2 uv = vUV.xy / uSize;
	float row = floor(uFrame / uSize.x) / uSize.y;
	float col = fract(uFrame / uSize.x);
	vec2 f = vec2(col, row);
	gl_FragColor = texture2D(uTexture, uv + f);
}