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
	vNormal = uNormalMatrix * aNormal;
	vec4 mvPosition = uViewMatrix * vec4(aPosition, 1.0);
	vPosition = (uMatrix * vec4(aPosition, 1.0)).xyz;
	gl_Position = uProjection * mvPosition;

	vec3 incident = normalize(mvPosition.xyz);
	vec3 ln = aNormal * vec3(0.9, 0.9, 1.0);
	vRefVec = reflect(incident, ln);

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
uniform sampler2D uDecoTexture;
uniform sampler2D uNoiseTexture;

float brightness(vec3 c) {
    return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
}

const float a = -0.1;
const float r = 0.5;
   
void main() {

	vec2 uv = vUV;
	uv.x = (1.0 - uv.x) * 2.0;

	vec3 deco = texture2D(uDecoTexture, uv * 2.0).rgb;

	vec3 rf = -vRefVec;
	vec2 nuv;
	nuv.x = 0.5 - atan(rf.z, rf.x) / PI2;
	nuv.y = 0.5 - asin(rf.y) / PI;
	nuv.x = 1.0 - nuv.x;

	vec3 noisecol = texture2D(uNoiseTexture, nuv).rgb;

	vec2 disp = noisecol.rb;
	disp.x *= deco.r;
	disp.y *= deco.r;

	vec2 refuv = nuv + disp;

	float fade = distance(nuv, vec2(0.5, 0.5)) * 2.0;

	fade = smoothstep(0.6, 1.0, fade);

	vec3 refcol = mix(texture2D(uTexture, refuv).rgb, vec3(1.0, 0.0, 0.0), fade);
	

	float ref = brightness(refcol) * 1.5;
	ref = 0.2 + ref * 1.0;

	float dif = (dot(vNormal, uLight) * 0.5 + 0.5) * 1.5;
	dif = smoothstep(-0.4, 1.0, dif);

    vec3 eyed = -normalize(uEyePosition - vPosition);
    vec3 refd = reflect(uLight, vNormal);
    float spec = pow(max(0.0, dot(refd, eyed)), 12.0) * (0.5 + deco.r);

	vec3 difred = vec3(ref, 0.0, 0.0);
	vec3 diffull = vec3(ref, ref, ref);
	vec3 speccol = vec3(1.0, 1.0, 1.0);

	vec3 difcol = mix(difred, diffull, deco.r);
	gl_FragColor = vec4(difcol * dif + speccol * spec, 1.0); 
}

















