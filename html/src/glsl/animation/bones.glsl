#ifndef NUM_BONES
	#define NUM_BONES 1
#endif

#ifndef BONE_PER_VERTEX
	#define BONE_PER_VERTEX 4
#endif

attribute vec4 aIndex;
attribute vec4 aWeight;

uniform mat4 uBones[NUM_BONES];

vec3 bones(vec3 v) {
	mat4 bone;
	vec3 vs[BONE_PER_VERTEX];
	vec3 r = vec3(0.0, 0.0, 0.0);

	bone = uBones[int(aIndex.x)];
	r += (bone * vec4(v, 1.0)).xyz * aWeight.x;

	#if (BONE_PER_VERTEX > 1)
	bone = uBones[int(aIndex.y)];
	r += (bone * vec4(v, 1.0)).xyz * aWeight.y;
	#endif

	#if (BONE_PER_VERTEX > 2)
	bone = uBones[int(aIndex.z)];
	r += (bone * vec4(v, 1.0)).xyz * aWeight.z;
	#endif

	#if (BONE_PER_VERTEX > 3)
	bone = uBones[int(aIndex.w)];
	r += (bone * vec4(v, 1.0)).xyz * aWeight.w;
	#endif

	return r.xyz;
}