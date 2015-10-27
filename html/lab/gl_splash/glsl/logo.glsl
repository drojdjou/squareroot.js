//#name normal2color.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform vec3 uEyePosition;

varying vec3 vNormal;
varying vec3 vRefVec;
varying vec2 vUV;
	 
void main() {

	vec4 p = uMatrix * vec4(aPosition, 1.0);

	vUV = aUV;
	vNormal = uNormalMatrix * aNormal;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);

	vec3 incident = normalize(p.xyz - uEyePosition);
	vRefVec = reflect(incident, vNormal);
}

//#fragment
precision mediump float;

varying vec3 vNormal;
varying vec3 vRefVec;
varying vec2 vUV;

uniform sampler2D uTexture;
uniform sampler2D uRamp;
uniform vec3 uLight;

void main() {
	float l = 0.66 + 0.66 * max(0.0, dot(uLight, vNormal));
	vec3 c = texture2D(uTexture, vUV).rgb;

	vec3 np = vRefVec;
	float y = clamp(np.y * 0.5 + 0.5, 0.0, 1.0);
	vec3 r = texture2D(uRamp, vec2(0.5, y)).rgb;

	gl_FragColor = vec4(c * r * l, 1.0);
}








