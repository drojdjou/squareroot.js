//#vertex
attribute vec4 aParticleParam;

uniform mat4 uConcatMatrix;
uniform float uTime;
uniform float uBeat;
uniform float uDamp;

varying vec4 vParam;
varying vec3 vPosition;
     
void main() {
	vParam = aParticleParam;

	float angle = aParticleParam.x;
	float speed = aParticleParam.y;
	float depth = pow(aParticleParam.z, 8.0);
	float damp = aParticleParam.w;

	vParam.x += uTime * speed;

	float beatFactor = abs((uTime - uBeat - 0.4)) * 0.5 * damp;
	beatFactor = 1.0 - clamp(beatFactor, 0.0, 1.0);
	beatFactor = smoothstep(0.0, 1.0, beatFactor);

	float radius = 95.0 + (60.0 * depth + beatFactor * 95.0 * damp) * (0.2 + uDamp);

	vec3 p = vec3(sin(angle + uTime * speed) * radius, 0, cos(angle + uTime * speed) * radius);

	gl_Position = uConcatMatrix * vec4(p, 1.0);
	gl_PointSize = 1.0;

	vPosition = gl_Position.rgb;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

varying vec4 vParam;
varying vec3 vPosition;

uniform float uDamp;
               
void main() {

	float c = 0.3 + 0.7 * uDamp;
	float t = abs(fract(vParam.x / 6.28) * 2.0 - 1.0);

	gl_FragColor = vec4(0.8 + 0.6 * t, 1.4 - t, 0.75 + t * 0.5, c);
	// gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}