// shader.glsl
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
varying vec3 vPosition;
varying vec3 vRefVec;

void main()
{
	vNormal = normalize(aNormal);
	vec4 mvPosition = uViewMatrix * vec4(aPosition, 1.0);
	vPosition = (uMatrix * vec4(aPosition, 1.0)).xyz;
	gl_Position = uProjection * mvPosition;

	vec3 incident = normalize(mvPosition.xyz);
	vRefVec = reflect(incident, vNormal);

	vUV = aUV;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265359
#define PI2 6.28318530718

varying vec3 vNormal;
varying vec2 vUV;
varying vec3 vPosition;
varying vec3 vRefVec;

uniform vec3 uLight;
uniform vec3 uEyePosition;

uniform sampler2D uTexture;

float brightness(vec3 c) {
    return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
}
   
void main() {


	vec3 rf = -vRefVec;
	float u = 0.5 - atan(rf.z, rf.x) / PI2;
	float v = 0.5 - asin(rf.y) / PI;
	// u = 1.0 - u;

	vec3 refcol = texture2D(uTexture, vec2(u, v)).rgb;

	float dif = (dot(vNormal, uLight) * 0.5 + 0.5) * 1.0;
	dif = smoothstep(-0.4, 1.0, dif);

    vec3 eyed = -normalize(uEyePosition - vPosition);
    vec3 refd = reflect(uLight, vNormal);
    float spec = pow(max(0.0, dot(refd, eyed)), 12.0);

	gl_FragColor = vec4(refcol * dif + refcol * spec, 1.0); 
}

















