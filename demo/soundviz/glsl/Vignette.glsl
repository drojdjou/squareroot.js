//#vertex
precision mediump float;
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

void main(void) {
    gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    vTextureCoord = aTextureCoord;  
}

//#fragment
precision mediump float;
uniform sampler2D uTexture;
varying vec2 vTextureCoord;

uniform float uTime;
uniform float uBeat;

const vec2 chromaticOffset = vec2(0.12, 0.12);

float whiteNoise(vec2 uv, float scale) {
	// from Three.js / film shader
	float x = (uv.x + 0.2) * (uv.y + 0.2) * (10000.0 + uTime);
	x = mod( x, 13.0 ) * mod( x, 123.0 );
	float dx = mod( x, 0.005 );
	return clamp( 0.1 + dx * 100.0, 0.0, 1.0 ) * scale;
}

void main(void) {

	float d = (0.5 - distance(vTextureCoord, vec2(0.5, 0.5))) * 0.3 * uBeat;

	vec2 vt = vTextureCoord;

	vt.x += (smoothstep(0.25, 0.75, fract(vt.y * 80.0)) * 0.1- 0.05) * (uBeat);
	// vt.y += (smoothstep(0.25, 0.75, fract(vt.x * 80.0)) * 0.1 - 0.05) * (uBeat);

	float p = 1.0;

    float cr = texture2D(uTexture, vt + chromaticOffset * d).r * p;
    float cg = texture2D(uTexture, vt).g * p;
    float cb = texture2D(uTexture, vt - chromaticOffset * d).b * p;

    vec3 c = vec3(cr, cg, cb) + whiteNoise(vTextureCoord, uBeat * cr * 1.0);

    gl_FragColor = vec4(c, 1.0);
}