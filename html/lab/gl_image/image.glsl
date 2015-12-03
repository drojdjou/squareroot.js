// image.glsl
//#vertex
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uProjection;
uniform mat4 uViewMatrix;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}
     
//#fragment
#ifdef GL_ES
precision mediump float;
#endif
               
varying vec2 vUV;
uniform sampler2D uTexture;

uniform float uLensCorrection;
uniform float uZoom;

const vec2 center = vec2(0.5);
               
void main() {

	vec2 uv = vUV;
	float d = length(uv - center);

	vec2 dvr = uv - center;
	vec2 dvg = uv - center;
	vec2 dvb = uv - center;

	dvr *= 1.0 * uZoom - d * 1.2 * uLensCorrection;
	dvg *= 1.0 * uZoom - d * 1.0 * uLensCorrection;
	dvb *= 1.0 * uZoom - d * 0.8 * uLensCorrection;
	
	float ir = texture2D(uTexture, center + dvr).r;
	float ig = texture2D(uTexture, center + dvg).g;
	float ib = texture2D(uTexture, center + dvb).b;

	gl_FragColor = vec4(ir, ig, ib, 1.0);
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}