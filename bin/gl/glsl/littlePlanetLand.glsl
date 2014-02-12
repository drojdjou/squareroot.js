//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uMatrix;

varying vec2 vt;
varying vec3 vn;
varying vec3 vp;

varying float vHeight;

uniform sampler2D uTexture;
uniform float uMultiplier;
uniform float uMinimum;
     
void main() {
	vt = aTextureCoord;

	float land = texture2D(uTexture, vt).r;
	vec3 position = aVertexPosition;

	vHeight = land;

	position *= (1.0 + (land - 0.5) * 2.0 * uMultiplier);

	vn = uNormalMatrix * aVertexNormal;
	vp = (uMatrix * vec4(position, 1.0)).xyz;
	gl_Position = uConcatMatrix * vec4(position, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec3 uColorLow;
uniform vec3 uColorHigh;

varying vec2 vt;
varying vec3 vn;
varying vec3 vp;

varying float vHeight;

const float ambient = 0.2;
                             
void main() {

	vec3 lt = vec3(100.0, 0, 200.0) - vp;
	lt = normalize(lt);

	vec3 c = mix(uColorLow, uColorHigh, vHeight);
	float dif = dot(vn, -lt) * 0.5 + 0.5;
	dif = max(dif, 0.0);
    dif = 0.7 * (ambient + (1.0 - ambient) * smoothstep(0.4, 1.0, dif));
    c = c * dif;

	gl_FragColor = vec4(c, 1.0);

}