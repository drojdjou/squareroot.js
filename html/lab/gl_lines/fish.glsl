// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uProjection;

varying vec3 vNormal;
     
void main() {
	vNormal = uNormalMatrix * normalize(aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

//#include sphar-data
//#include sphar
              
varying vec3 vNormal;
       
void main() {
	vec3 n = vNormal;
	n.z *= -1.0;
    gl_FragColor = vec4(sphericalHarmonics(n) * 1.66, 1.0);
}








