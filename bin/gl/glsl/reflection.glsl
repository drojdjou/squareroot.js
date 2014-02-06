//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;
uniform mat4 uMatrix;

uniform vec3 uEyePosition;

varying vec3 refVec;
     
void main() {
	vec3 normal = normalize(uNormalMatrix * aVertexNormal);
	vec3 worldPosition = (uMatrix * vec4(aVertexPosition, 1.0)).xyz;
	vec3 incident = normalize(worldPosition - uEyePosition);
	refVec = reflect(incident, normal);
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform samplerCube uCubemap;
uniform vec4 uColor;
               
varying vec3 refVec;

              
void main() {
	vec3 r = textureCube(uCubemap, refVec).rgb;
	gl_FragColor = vec4(r, 1.0);
}