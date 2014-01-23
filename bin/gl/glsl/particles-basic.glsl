//#vertex
attribute vec3 aVertexPosition;
attribute vec3 aVertexSpeed;

uniform mat4 uConcatMatrix;
uniform vec3 uOffset;
uniform float uSize;
uniform float uTime;

varying float z;
     
void main() {
	vec3 p = mod(aVertexPosition - uOffset * 0.5, uSize) - uSize * 0.5;
	vec3 s = aVertexSpeed;
	s.x = s.x + sin(uTime * s.y) / 100.0;
	// p = p + s * uTime;
	z = 1.0 - length(p) / (uSize * 0.5);
	gl_Position = uConcatMatrix * vec4(p, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
          
uniform vec4 uColor;

varying float z;
               
void main() {
	// gl_FragColor = vec4(uColor.rgb * z, 1.0);
	gl_FragColor = vec4(1.0, 1.0, 1.0, z);
}