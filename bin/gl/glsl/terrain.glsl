//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
	vNormal = uNormalMatrix * aVertexNormal;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;
uniform vec3 uFogColor;
uniform float far;
uniform float near;
               
varying vec3 vNormal;
               
void main() {
	vec3 lt = normalize(vec3(200.0, 0, 0));
	float dif = dot(vNormal, -lt) * 0.5 + 0.5;
	float depth = 1.0 - (gl_FragCoord.z / gl_FragCoord.w - near) / (far - near);
	depth = clamp(depth, 0.0, 1.0);
	// depth = 1.0 - pow(1.0 - depth, 2.0);
	gl_FragColor = vec4(uColor.rgb * dif * depth + (1.0 - depth) * uFogColor, 1.0);
}