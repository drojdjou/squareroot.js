//#name standardLight

/*#docs

@description <p>A collection of light related functions</p> 

<p>Includes diffuse(), specular() and brightness()</p>

*/

vec3 diffuse(vec3 n, vec3 l, vec3 c, float i) {
	#ifdef HEMISPEHERE_DIFFUSE
	return (dot(-l, n) * 0.5 + 0.5) * c * i;
	#else
	return max(0.0, dot(-l, n)) * c * i;
	#endif
}

vec3 specular(vec3 n, vec3 v, vec3 l, vec3 c, float sh, float i) {
	return pow(max(0.0, dot(reflect(-l, n), v)), sh) * c.rgb * i;
}

float brightness(vec3 c) {
	return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;
}