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
     
void main() {
	vNormal = aNormal;
	vUV = aUV;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;
varying vec2 vUV;

uniform sampler2D uTexture;

const vec2 sunPos = vec2(1.3, 0.57);
           
void main() {
	// gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);

	float p = (vUV.y - 0.5) * 2.0 + 0.25;
	vec2 suv = vUV;
	suv.x *= 2.0;
	float sd = smoothstep(0.02, 0.04, distance(suv, sunPos));

	vec3 skycol = texture2D(uTexture, vec2(0.5, p)).rgb;

	vec3 color = mix(vec3(1.0, 1.0, 1.0), skycol, sd);

	gl_FragColor = vec4(color, 1.0);
}