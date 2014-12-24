// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uViewMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uProjection;

varying vec3 vNormal;
varying vec2 vUV;
     
void main() {
    vUV = aUV;
	vNormal = uNormalMatrix * aNormal;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision mediump float;
#endif

//#include ~light/sphar-eucalyptus.glsl
//#include ~light/sphar.glsl
              
varying vec3 vNormal;
varying vec2 vUV;
       
void main() {
    gl_FragColor = vec4(sphericalHarmonics(vNormal), 1.0);
}








