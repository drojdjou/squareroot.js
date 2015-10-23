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
	vUV = aUV;
	vNormal = normalize(uNormalMatrix * aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;
varying vec2 vUV;

uniform sampler2D uTexture;
           
void main() {
	vec3 t = texture2D(uTexture, vUV).rgb;
	float l = 0.6 + 0.4 * dot(vNormal, vec3(1.0, 0.0, 0.0));
	gl_FragColor = vec4(t * l, 1.0);
}