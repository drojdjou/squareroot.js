// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aUV;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec2 vUV;
     
void main() {
	vUV = aUV;
	vNormal = uNormalMatrix * normalize(aNormal);
	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_PointSize = 2.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;
varying vec2 vUV;

uniform sampler2D uTexture;
           
void main() {
	// vec3 color = texture2D(uTexture, vUV).rgb;
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	// gl_FragColor = vec4(vNormal * 0.5 + color, 1.0);
	gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);
}