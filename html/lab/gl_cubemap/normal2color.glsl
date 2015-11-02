// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = aNormal;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;

uniform vec3 uColor;        
uniform vec3 uLight;

void main() {
	float l = 0.5 + 0.5 * max(0.0, dot(vNormal, uLight));
	gl_FragColor = vec4(uColor * l, 1.0);
}