// image.glsl
//#vertex
attribute vec2 aPosition;
attribute vec2 aUV;

// uniform mat4 uProjection;
// uniform mat4 uViewMatrix;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = vec4(aPosition, 0.0, 1.0);
	// gl_Position = uProjection * uViewMatrix * vec4(aPosition, 0.0, 1.0);
}
     
//#fragment
#ifdef GL_ES
precision mediump float;
#endif
               
varying vec2 vUV;
uniform sampler2D uTexture;

const float PI = 3.14159265359;
const float PI2 = 6.28318530718;

uniform float uTime;
           
void main() {

	vec2 center = vec2(0.5, 0.5);
	vec2 uv = vUV;
	vec2 v = center - uv;

	float a = atan(v.x, v.y);
	a = a / PI;
	a = a * 0.5 + 0.5;

	a += (uTime + uv.y) * 0.00005;
	a = mod(a, 1.0);

	float d = min(1.0, length(v) * 1.5);
	d = 1.0 - pow(1.0 - d, 1.6);

	vec3 c = texture2D(uTexture, vec2(a, d)).rgb;
	gl_FragColor = vec4(c, 1.0);
	// gl_FragColor = vec4(a, 0.0, 0.0, 1.0);
}