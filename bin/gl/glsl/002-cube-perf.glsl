//#vertex
attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat3 uNormalMatrix;
uniform mat4 uConcatMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = uNormalMatrix * aNormal;
	gl_Position = uConcatMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
          
varying vec3 vNormal;
               
void main() {
	gl_FragColor = vec4(0.5 + vNormal * 0.5, 1.0);
}