// normal2color.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;
attribute vec4 aIndex;
attribute vec4 aWeight;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

#ifndef NUM_BONES
	#define NUM_BONES 200
#endif

#ifndef BONE_PER_VERTEX
	#define BONE_PER_VERTEX 1
#endif

uniform mat4 uBones[NUM_BONES];

varying vec3 vNormal;

void main() {

	vec3 po = aPosition;

	vNormal = normalize(uNormalMatrix * aNormal);

	mat4 bone;
	vec3 p[BONE_PER_VERTEX];

	bone = uBones[int(aIndex.x)];
	p[0] = (bone * vec4(po, 1.0)).xyz;

	#if (BONE_PER_VERTEX > 1)
	bone = uBones[int(aIndex.y)];
	p[1] = (bone * vec4(po, 1.0)).xyz;
	#endif

	#if (BONE_PER_VERTEX > 2)
	bone = uBones[int(aIndex.z)];
	p[2] = (bone * vec4(po, 1.0)).xyz;
	#endif

	#if (BONE_PER_VERTEX > 3)
	bone = uBones[int(aIndex.w)];
	p[3] = (bone * vec4(po, 1.0)).xyz;
	#endif

	#if (BONE_PER_VERTEX == 4)
	po = p[0] * aWeight.x + p[1] * aWeight.y + p[2] * aWeight.z + p[3] * aWeight.w;
	#elif (BONE_PER_VERTEX == 3)
	po = p[0] * aWeight.x + p[1] * aWeight.y + p[2] * aWeight.z;
	#elif (BONE_PER_VERTEX == 2)
	po = p[0] * aWeight.x + p[1] * aWeight.y;
	#elif (BONE_PER_VERTEX == 1)
	po = p[0] * aWeight.x;
	#endif
	

	// gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
	gl_Position = uProjection * uViewMatrix * vec4(po.xyz, 1.0);
	gl_PointSize = 3.0;
}

//#fragment
precision mediump float;
      
varying vec3 vNormal;   
           
void main() {
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	// gl_FragColor = vec4(vWeight.x, vWeight.y, 0.0, 1.0);
	gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);
}