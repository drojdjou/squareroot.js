// wire-dot.glsl
//#vertex
attribute float aPhase;
attribute float aOffset;
attribute float aSpeed;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform float uDotSize;
uniform vec3 uStart;
uniform vec3 uEnd;
uniform vec3 uOffset;
uniform float uTime;

varying float vIntensity;

void main() {
	float t = fract(aPhase + uTime * 0.001 * aSpeed);
	vec3 p = mix(uStart, uEnd, t);

	p += uOffset * sin(aOffset * uTime * 0.01) * 2.0 * aSpeed;

	vIntensity = pow(sin(t * 3.14), 0.8);

	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
	gl_PointSize = uDotSize;
}

//#fragment
precision highp float;
               
uniform vec3 uColor;

varying float vIntensity;

void main() {
	vec3 c = mix(uColor * 1.0, uColor * 3.0, vIntensity);
	gl_FragColor = vec4(c * vIntensity, 1.0);
}