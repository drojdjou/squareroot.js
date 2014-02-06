
//#vertex
//#include VertexInclude
precision mediump float;
precision highp int;

attribute vec3 aVertexPosition;
// attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uConcatMatrix;
uniform vec3 uEyePosition;
uniform float uDistance;

varying vec3 vPosition;
varying vec2 vTexCoord;

void main(void) {
	gl_Position = uConcatMatrix * vec4(uEyePosition + aVertexPosition * uDistance, 1.0);
	vPosition = aVertexPosition;	
	vTexCoord = aTextureCoord;
}

//#fragment
precision mediump float;
precision highp int;

uniform samplerCube uCubemap;
uniform float uBeat;
uniform float uTime;

varying vec3 vPosition;
varying vec2 vTexCoord;

vec3 getcolor(vec3 p) {
	// float m = p.z + p.x + uTime * -0.02;
	// float c = 1.0 - step(uBeat, fract(m * 20.0));
	// return vec3(fract(m));

	return p * 0.5 + vec3(0.5);
}

void main(void) {
	// vec3 c = textureCube(uCubemap, vPosition).rgb;
	// gl_FragColor = vec4(c, 1.0);
	// gl_FragColor = vec4(0, 0, 0, 1.0);
	gl_FragColor = vec4(getcolor(vPosition), 1.0);
}