//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying float vFog;
varying float vFloorLevel;
varying vec2 vTextureCoord;
     
void main() {
	vTextureCoord = aTextureCoord;
	vNormal = uNormalMatrix * aVertexNormal;
	vFloorLevel = aVertexPosition.z;
	vec3 p = (uViewMatrix * uMatrix * vec4(aVertexPosition, 1.0)).xyz;
	float d = 1.0 - length(p) / 400.0;
	vFog = clamp(d * 2.0, 0.0, 1.0);
	gl_Position = uConcatMatrix * vec4(aVertexPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform float uBuildingHeight;
uniform float uBeat;
uniform vec3 uWindowColor;
uniform float uDayTime;
               
varying vec3 vNormal;
varying float vFog;
varying float vFloorLevel;
varying vec2 vTextureCoord;

const vec2 center = vec2(0.5, 0.5);

const vec3 bottomDay = vec3(0.5, 0.25, 0.4);
const vec3 bottomNight = vec3(0.1, 0, 0.0);
const vec3 lightDir = vec3(1.0, 0.0, 0.0);
               
void main() {
	float limit = 0.8 - uBeat * 0.4;

	float fl = step(limit, fract(vFloorLevel * uBuildingHeight));
	vec3 floorLight = vec3(fl);

	vec3 nc = uWindowColor * floorLight;
	float light = max(0.0, dot(vNormal, lightDir));
	vec3 dc = floorLight * (0.1 + light * 0.9);

	vec3 col = mix(dc, nc, uDayTime);
	vec3 fog = mix(bottomDay, bottomNight, uDayTime);

	gl_FragColor = vec4(mix(fog, col, vFog), 1.0);
}
















