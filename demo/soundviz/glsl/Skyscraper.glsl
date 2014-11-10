//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uConcatMatrix;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vLocalNormal;
varying float vScreenY;
varying float vFog;
varying float vFloorLevel;
varying vec2 vTextureCoord;

void main() {
	vTextureCoord = aTextureCoord;
	vLocalNormal = aVertexNormal;
	vNormal = uNormalMatrix * aVertexNormal;
	vFloorLevel = aVertexPosition.z;
	vec3 p = (uViewMatrix * uMatrix * vec4(aVertexPosition, 1.0)).xyz;
	float d = 1.0 - length(p) / 400.0;
	vFog = clamp(d * 2.0, 0.0, 1.0);
	vec4 s = uConcatMatrix * vec4(aVertexPosition, 1.0);
	vScreenY = ( (s.y/800.0) + 1.0) * 0.5;
	gl_Position = s;
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
varying vec3 vLocalNormal;
varying float vScreenY;
varying float vFog;
varying float vFloorLevel;
varying vec2 vTextureCoord;

const vec2 center = vec2(0.5, 0.5);

// -
// const vec3 fogDay = vec3(0.5, 0.25, 0.4);
// --
const vec3 topDay = vec3(0, 0.25, 0.5);
const vec3 bottomDay = vec3(0.5, 0.25, 0.4);
// --

const vec3 fogNight = vec3(0, 0, 0.0);
const vec3 lightDir = vec3(1.0, 0.0, 0.0);

float whiteNoise(vec2 uv, float scale) {
	// from Three.js / film shader
	float x = (uv.x + 0.2) * (uv.y + 0.2) * (10000.0 + uDayTime);
	x = mod( x, 13.0 ) * mod( x, 123.0 );
	float dx = mod( x, 0.005 );
	return clamp( 0.1 + dx * 100.0, 0.0, 1.0 ) * scale;
}
               
void main() {
	float limit = 0.8 - uBeat * 0.7;

	float fl = step(limit, fract(vFloorLevel * uBuildingHeight));
	vec3 floorLight = vec3(fl);

	vec3 nc = uWindowColor * floorLight;// * whiteNoise(vec2(vFloorLevel), 2.0);
	float light = max(0.0, dot(vNormal, lightDir));
	vec3 dc = floorLight * (0.1 + light * 0.9);

	vec3 fogDay = mix(bottomDay, topDay, vScreenY);
	vec3 col = mix(dc, nc, uDayTime);
	vec3 fog = mix(fogDay, fogNight, uDayTime);

	if(vLocalNormal.z == 0.0) {
		gl_FragColor = vec4(mix(fog, col, vFog), 1.0);
	} else {
		gl_FragColor = vec4(0, 0, 0, 1.0);
	}
}
















