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
     
void main() {
	vt = aTextureCoord;
	vn = uNormalMatrix * aVertexNormal;
	vp = (uMatrix * vec4(aVertexPosition, 1.0)).xyz;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;
uniform sampler2D uTexture;
uniform float uTime;

varying vec2 vt;
varying vec3 vn;
varying vec3 vp;

const float ambient = 0.1;
                             
void main() {

	vec3 lt = vec3(200.0, 0, 0) - vp;
	lt = normalize(lt);
	vec3 tex = texture2D(uTexture, vt).rgb;
	vec3 c = uColor.rgb + tex;
	float dif = dot(vn, -lt) * 0.5 + 0.5;
	dif = max(dif, 0.0);
    dif = 0.7 * (ambient + (1.0 - ambient) * smoothstep(0.4, 1.0, dif));
    c = c * dif;

	// gl_FragColor = vec4(c, 1.0);
	gl_FragColor = vec4(tex, 1.0);
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}