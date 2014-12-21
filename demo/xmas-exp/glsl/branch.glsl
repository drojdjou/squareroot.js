// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute float aColor;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec4 vPosition;
varying float vColor;
     
void main() {
	vNormal = uNormalMatrix * aNormal;
	vColor = aColor;
	vPosition = uMatrix * vec4(aPosition, 1.0);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

//#include ~light/sphar-cathedral.glsl
//#include ~light/sphar.glsl
               
varying vec3 vNormal;
varying float vColor;
varying vec4 vPosition;

const vec3 leafColor = vec3(0.144, 0.285, 0.109);
const vec3 branchColor = vec3(0.201, 0.102, 0.080);
           
void main() {
	// gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);

	vec3 color;
	vec3 light = 0.5 + 0.5 * sphericalHarmonics(vNormal);

	if(vColor > 0.5) color = leafColor * vColor * 3.0;
	else color = branchColor * 1.0 * vColor;

	gl_FragColor = vec4(color * light, 1.0);
}















