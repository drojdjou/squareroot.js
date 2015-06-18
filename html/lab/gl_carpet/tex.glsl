// normal2color.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec2 vUV;
     
void main() {
	vNormal = normalize(uNormalMatrix * aNormal);
	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;
     
varying vec3 vNormal;          
varying vec2 vUV;

uniform sampler2D uTexture;

const vec3 cLight = vec3(1.0, -0.1, 0.0);
const vec3 cHi = vec3(0.8, 0.9, 1.0);
           
void main() {

	float l = abs(0.5 + 0.5 * dot(vNormal, cLight));
	vec3 c = texture2D(uTexture, vUV).rgb;

	float ll = smoothstep(0.6, 0.9, l);

	gl_FragColor = vec4(cHi * ll + c * l, 1.0);
}