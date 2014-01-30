//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
     
void main() {
	vTextureCoord = aTextureCoord;
	vNormal = aVertexNormal;
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform float uDayTime;
               
varying vec2 vTextureCoord;
varying vec3 vNormal;

const vec3 topDay = vec3(0, 0.25, 0.5);
const vec3 bottomDay = vec3(0.5, 0.25, 0.4);

const vec3 topNight = vec3(0, 0, 0);
const vec3 bottomNight = vec3(0.0, 0, 0.0);
               
void main() {
	vec3 t = mix(topDay, topNight, uDayTime);
	vec3 b = mix(bottomDay, bottomNight, uDayTime);
	vec3 c = mix(t, b, vTextureCoord.y);
	gl_FragColor = vec4(c , 1.0);
}