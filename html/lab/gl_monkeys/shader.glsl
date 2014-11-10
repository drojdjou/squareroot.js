// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uConcatMatrix;
uniform mat4 uProjection;

varying vec3 vNormal;
     
void main() {
	vNormal = uNormalMatrix * aNormal;
	gl_Position = uProjection * uViewMatrix * uMatrix * vec4(aPosition, 1.0);
	// gl_Position = uConcatMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;
           
void main() {
	gl_FragColor = vec4(vNormal * 0.4 + vec3(0.6), 1.0);
}