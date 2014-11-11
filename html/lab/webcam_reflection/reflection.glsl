// shader.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
varying vec3 vNormalLoc;
varying vec3 vRefVec;
varying vec3 vRetVec;
varying float rfac;

void main()
{
	vNormalLoc = aNormal;
	vNormal = normalize(uNormalMatrix * aNormal);

	vec4 mPosition = uMatrix * vec4(aPosition, 1.0);
	vec4 mvPosition = uViewMatrix * vec4(aPosition, 1.0);

	gl_Position = uProjection * mvPosition;

	vec3 incident = normalize(mvPosition.xyz);

	vRetVec = refract(incident, vNormal, 1.0);
	vRefVec = reflect(incident, vNormal);

	// this.dispersionRed = 0.90;
	// 	this.dispersionGreen = 0.97;
	// 	this.dispersionBlue = 1.04;
	// 	this.bias = 0.9
	// 	this.scale = 0.7;
	// 	this.power = 1.1;

	rfac = 0.0 + 0.2 * pow(1.0 + dot(incident, vNormal), 1.2);	

}

//#fragment
#ifdef GL_ES
precision highp float;
#endif

#define PI 3.14159265359
#define PI2 6.28318530718

varying vec3 vNormal;
varying vec3 vNormalLoc;
varying vec3 vRefVec;
varying vec3 vRetVec;
varying float rfac;


uniform sampler2D uTexture;
   
// // http://en.wikipedia.org/wiki/UV_mapping#Finding_UV_on_a_sphere
    
void main() {

	vec3 d = -vRefVec;
	float u = 0.5 - atan(d.z, d.x) / PI2;
	float v = 0.5 - asin(d.y) / PI;
	vec3 ref = texture2D(uTexture, vec2(u, v)).rgb;

	d = -vRetVec;
	u = 0.5 - atan(d.z, d.x) / PI2;
	v = 0.5 - asin(d.y) / PI;
	vec3 ret = vec3(0.0, 0.0, 0.0);

	vec3 color = ret * rfac + ref * (1.0 - rfac);

	gl_FragColor = vec4(color, 1.0);
	// gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}


















