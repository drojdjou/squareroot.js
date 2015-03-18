// normal2color.glsl
//#vertex
attribute float aRotation;
attribute float aSpeed;
attribute float aLifetime;

varying float vRotation;
varying float vSpeed;
varying float vLifetime;

uniform float uTime;

uniform mat4 uViewMatrix;
uniform mat4 uProjection;

const float bounceMult = 0.004;
const float thrustMult = 0.0008;
   
void main() {

	vRotation = aRotation;
	vSpeed = aSpeed;

	float l = fract(aLifetime + uTime * thrustMult);
	vLifetime = smoothstep(-0.1, 0.8, l);

	vec4 p = vec4(0.0, 0.0, 0.0, 1.0);

	p.x = aSpeed * 0.6 + sin(aSpeed * uTime * bounceMult) * 1.5 * vLifetime;
	p.z = aSpeed * 0.4 + cos(aSpeed * uTime * bounceMult) * 2.5 * vLifetime;
	p.y = vLifetime * -20.0;

	gl_Position = uProjection * uViewMatrix * p;
	gl_PointSize = 32.0 + 192.0 * vLifetime;

}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uParticleTexture;
uniform float uTime;

varying float vRotation;
varying float vSpeed;
varying float vLifetime;

const vec2 offset = vec2(0.5, 0.5);
const float speedMult = 0.0002;

vec2 rotate2D(vec2 p, float a, vec2 o) {
	return vec2(cos(a) * (p.x - o.x) - sin(a) * (p.y - o.y) + o.x, sin(a) * (p.x - o.x) + cos(a) * (p.y - o.y) + o.y);
}

void main() {
	float a = vRotation + uTime * vSpeed * speedMult;
	vec2 p = rotate2D(gl_PointCoord, a, offset);
	float c = texture2D(uParticleTexture, p).r;
	vec3 cc = vec3(1.0, 0.7 + 0.3 * vLifetime, 0.5 + 0.5 * vLifetime) * (c * 1.2);
	gl_FragColor = vec4(cc, c * (1.0 - vLifetime));
}






