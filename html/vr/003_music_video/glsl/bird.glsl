// normal2color.glsl
//#vertex

//#include bones

attribute vec3 aNormal;
attribute vec3 aPosition;


uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;

void main() {

	vec3 p = bones(aPosition);
	vec3 n = bones(aNormal);

	vNormal = normalize(uNormalMatrix * n);
	gl_Position = uProjection * uViewMatrix * vec4(p, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
precision mediump float;

//#include sphar-data
//#include sphar
      
varying vec3 vNormal;   


uniform vec3 uColor;
           
void main() {
	gl_FragColor = vec4(sphericalHarmonics(vNormal) * uColor, 1.0);
}













