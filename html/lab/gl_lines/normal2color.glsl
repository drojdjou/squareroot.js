// normal2color.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = uNormalMatrix * aNormal;
	gl_Position = uProjection * uMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;
           
void main() {
	gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);
}