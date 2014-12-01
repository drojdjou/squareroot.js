// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uProjection;

varying vec3 vNormal;
     
void main() {
	vNormal = uNormalMatrix * normalize(aNormal);
	gl_Position = uProjection * uMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

//#include ~light/sphar-eucalyptus.glsl
//#include ~light/sphar.glsl
              
varying vec3 vNormal;
       
void main() {
	vec3 n = vNormal;
	n.z *= -1.0;
    gl_FragColor = vec4(sphericalHarmonics(n) * 1.33, 1.0);
}








