// basicLight.glsl
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
precision mediump float;

uniform vec3 uLightDirection;
uniform vec3 uColor;

varying vec3 vNormal;

void main() {
	float l = max(0.0, dot(vNormal, uLightDirection));
	gl_FragColor = vec4(uColor * l, 1.0);
}

