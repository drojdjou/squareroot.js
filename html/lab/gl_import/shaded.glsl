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
	vNormal = normalize(uNormalMatrix * aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
precision highp float;

//#include sphar-data
//#include sphar
               
varying vec3 vNormal;

uniform vec3 uLight;
uniform vec3 uColor;
           
void main() {
	gl_FragColor = vec4(uColor * sphericalHarmonics(vNormal), 1.0);
}