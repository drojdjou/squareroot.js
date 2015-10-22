// transition.glsl
//#vertex
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec2 vUV;
     
void main() {
	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;

uniform sampler2D uTextureA;
uniform sampler2D uTextureB;
uniform sampler2D uNoise;
uniform float uT;

varying vec2 vUV;
          
void main() {

#ifdef NOISE_ONLY

	vec3 n = texture2D(uNoise, vUV).rgb;
	gl_FragColor = vec4(n, 1.0);

#else

	float n = texture2D(uNoise, vUV).r - 0.5;
	float t = n + uT + vUV.x;
	t = clamp(t, 0.0, 1.0);
	vec3 a = texture2D(uTextureA, vUV + vec2(0.004 * t * n, 0.0)).rgb;
	vec3 b = texture2D(uTextureB, vUV - vec2(0.004 * t * n, 0.0)).rgb;
	gl_FragColor = vec4(mix(a, b, t), 1.0);

#endif

	
}