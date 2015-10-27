// normal2color.glsl
//#vertex
attribute vec3 aPosition;

uniform float uTime;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;

void main() {
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = POINT_SIZE;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexture;
uniform float uTime;

void main() {
	// vec4 c = texture2D(uTexture, gl_PointCoord);
	// gl_FragColor = vec4(c.rgb, c.a * 0.5);
	gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
