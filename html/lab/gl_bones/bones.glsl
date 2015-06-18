// normal2color.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec2 aIndex;
attribute vec2 aWeight;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

uniform mat4 uBones[3];

varying vec2 vWeight;
varying vec3 vNormal;

void main() {

	vWeight = aWeight;
	vNormal = normalize(uNormalMatrix * aNormal);

	vec3 po = aPosition;

	mat4 bone;
	vec3 p[2];

	bone = uBones[int(aIndex.x)];
	p[0] = (bone * vec4(po, 1.0)).xyz;

	bone = uBones[int(aIndex.y)];
	p[1] = (bone * vec4(po, 1.0)).xyz;

	po = (p[0] * aWeight.x + p[1] * aWeight.y);
	

	gl_Position = uProjection * uViewMatrix * vec4(po.xyz, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
precision mediump float;
         
varying vec2 vWeight;
varying vec3 vNormal;      
           
void main() {
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	// gl_FragColor = vec4(vWeight.x, vWeight.y, 0.0, 1.0);
	gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);
}