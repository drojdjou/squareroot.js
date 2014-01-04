//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

// uniform mat4 uMatrix;
// uniform mat4 uProjection;
// uniform mat4 uViewMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uConcatMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = uNormalMatrix * aVertexNormal;
	// gl_Position = uProjection * uViewMatrix * uMatrix * vec4(aVertexPosition, 1.0);
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

// uniform vec4 uColor;
// uniform vec3 uLightDir;
// uniform float uAmbientLight;
               
varying vec3 vNormal;
               
void main() {

	// vec3 c = uColor.rgb;
	// float a = uColor.a;
	// float amb = uAmbientLight;
	// float dif = max(dot(vNormal, uLightDir), 0.0);
	// gl_FragColor = vec4(c * amb + c * dif, a);

	gl_FragColor = vec4(0.5 + vNormal * 0.5, 1.0);
}