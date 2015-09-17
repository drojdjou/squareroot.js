// normal2color.glsl
//#vertex
attribute vec3 aPosition;
attribute float aSize;
attribute float aBrightness;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying float vBrightness;
  
void main() {
	vBrightness = aBrightness;
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = aSize;
}

//#fragment
precision highp float;

uniform sampler2D uTexture;
uniform float uTime;

varying float vBrightness;
                    
void main() {

	float b =  sin(uTime / 100.0 + vBrightness * 100.0) * 0.5 + 0.5;

	vec4 c = texture2D(uTexture, gl_PointCoord);
	c.a *= 0.25 + b * 0.75;
	gl_FragColor = c;
}