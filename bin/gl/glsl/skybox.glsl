
//#vertex
//#include VertexInclude
precision mediump float;
precision highp int;

attribute vec3 aVertexPosition;
// attribute vec3 aVertexNormal;
// attribute vec2 aTextureCoord;

uniform mat4 uConcatMatrix;
uniform vec3 uEyePosition;
uniform float uDistance;

varying vec3 vPosition;

void main(void) {
	gl_Position = uConcatMatrix * vec4(uEyePosition + aVertexPosition * uDistance, 1.0);
	vPosition = aVertexPosition;	
}

//#fragment
precision mediump float;
precision highp int;

uniform samplerCube uCubemap;

varying vec3 vPosition;

void main(void) {
	vec3 c = textureCube(uCubemap, vPosition).rgb;
	gl_FragColor = vec4(c, 1.0);
	// gl_FragColor = vec4(0, 0, 0, 1.0);

	// gl_FragColor = vec4(vPosition, 1.0);
}