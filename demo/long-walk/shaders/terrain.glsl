// normal2color.glsl
//#vertex
attribute vec3 aPosition;
attribute vec2 aUV;
attribute vec3 aNormal;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vLocalNormal;
varying vec3 vPosition;

void main() {
	vUV = aUV * 10.0;
	vPosition = aPosition;
	vLocalNormal = aNormal;
	vNormal = normalize(uNormalMatrix * aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;
               
uniform sampler2D uGrassTexture;
uniform sampler2D uSandTexture;
uniform sampler2D uRockTexture;
uniform sampler2D uSnowTexture;

varying vec2 vUV;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vLocalNormal;

uniform vec3 uLight;
uniform vec3 uSky;

void main() {
	vec3 grass = texture2D(uGrassTexture, vUV).rgb;
	vec3 sand = texture2D(uSandTexture, vUV).rgb;
	vec3 rock = texture2D(uRockTexture, vUV).rgb;
	vec3 snow = texture2D(uSnowTexture, vUV).rgb;

	float l = 0.7 + 0.3 * dot(vNormal, uLight);

	float i = max(0.0, dot(vLocalNormal, vec3(0.0, -1.0, 0.0)));

	vec3 c;

	
	c = mix(sand, grass, smoothstep(0.0, 2.0, -vPosition.y));
	c = mix(c, snow, smoothstep(8.0, 11.0, -vPosition.y));

	vec3 r = mix(rock, snow, smoothstep(9.5, 16.0, -vPosition.y));


	r = mix(rock, r, smoothstep(0.80, 0.88, i));
	c = mix(r, c, smoothstep(0.88, 0.90, i));

	c = c * max(l, 0.0);

	float w = 1.0 - (gl_FragCoord.z / gl_FragCoord.w) / 120.0;
	w = clamp(w, 0.0, 1.0);
	c = mix(uSky, c, w);

	gl_FragColor = vec4(c, 1.0);
}