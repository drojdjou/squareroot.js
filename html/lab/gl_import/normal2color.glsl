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
	gl_PointSize = 2.0;
}

//#fragment
precision highp float;
               
varying vec3 vNormal;
           
void main() {
	#ifdef COLOR_ONLY
	gl_FragColor = vec4(COLOR, 1.0);
	#else
	gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);
	#endif
}