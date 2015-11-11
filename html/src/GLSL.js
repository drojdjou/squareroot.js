/**
 * @namespace GLSL
 * @memberof SQR
 * @description The global namespace holding GLSL code of all built-in shaders and shader chunks.
 */
SQR.GLSL = {

	/**
	 * @property diffspec
	 * 
	 * @description <p>A general purpose diffuse-specular shader.</p> 
	 * 
	 * <p>It is used internally by the Unity scene parses as the default shader. 
	 * It works with several light related uniforms, but for now only one light per
	 * shader is supported as well it can only be a directiona light.</p>
	 * 
	 * <p>This shader is meant to make working with basic shading easier, but is not 
	 * intended to be some sort of one-shader-to-rule-them-all, so in most scenarios
	 * a custom GLSL shader might be required.</p>
	 * 
	 * <a href='https://github.com/drojdjou/squareroot.js/tree/master/html/src/glsl/builtin/diffspec.glsl'>Shader source</a>
	 */
	"diffspec": "/*#docs*/\n//#vertex\nprecision mediump float;\nattribute vec3 aNormal;\nattribute vec3 aPosition;\nattribute vec2 aUV;\nuniform mat4 uMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjection;\nuniform mat3 uNormalMatrix;\nuniform vec3 uEyePosition;\nvarying vec3 vNormal;\nvarying vec3 vIncident;\nvarying vec2 vUV;\nvoid main() {\n	vNormal = uNormalMatrix * aNormal;\n	vec3 p = (uMatrix * vec4(aPosition, 1.0)).xyz;\n	vIncident = normalize(p - uEyePosition);\n	vUV = aUV;\n	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);\n}\n//#fragment\nprecision mediump float;\n//#include standardLight\nuniform vec4 uEmissiveColor;\n	uniform vec3 uLightDirection;\n	uniform vec4 uDiffuseColor;\n	#ifdef USE_SPECULAR\n	uniform vec4 uSpecularColor;\n	uniform float uShininess;\n	#endif\n#ifdef USE_DIFFUSE_MAP\nuniform sampler2D uDiffuseMap;\nuniform vec4 uTextureTileOffset;\nvec4 texture(sampler2D t, vec2 uv) {\n	return texture2D(t, uv * uTextureTileOffset.xy + uTextureTileOffset.zw);\n}\n#endif\n#ifdef USE_SPECULAR_MAP\nuniform sampler2D uSpecularMap;\n#endif\nvarying vec3 vNormal;\nvarying vec3 vIncident;\nvarying vec2 vUV;\nvoid main() {\n	#ifdef USE_DIFFUSE_MAP\n	vec3 dm = uDiffuseColor.rgb * texture(uDiffuseMap, vUV).rgb;\n	#else\n	vec3 dm = uDiffuseColor.rgb;\n	#endif\n	vec3 e = (uEmissiveColor.rgb* dm.rgb) * uEmissiveColor.a;\n	vec3 d = diffuse(vNormal, uLightDirection, dm.rgb, uDiffuseColor.a);\n	#ifdef USE_SPECULAR_MAP\n	#define SI uSpecularColor.a * texture(uSpecularMap, vUV).r\n	#else\n	#define SI uSpecularColor.a\n	#endif\n	#ifdef USE_SPECULAR\n	#define SP specular(vNormal, vIncident, uLightDirection, uSpecularColor.rgb, uShininess, SI)\n	#else \n	#define SP vec3(0.0) \n	#endif\n	gl_FragColor = vec4(e + d + SP, 1.0);\n}\n",

	/**
	 * @property normal2color
	 * 
	 * @description <p>A simple debug shader</p> 
	 * 
	 * <p>The direction of the normal is translated into the color for each pixel. Simple and useful for debugging.</p>
	 * 
	 * <a href='https://github.com/drojdjou/squareroot.js/tree/master/html/src/glsl/builtin/normal2color.glsl'>Shader source</a>
	 */
	"normal2color": "/*#docs*/\n//#vertex indicates that this is where the vertex shader starts\n//#fragment indicates that this is where the fragment shader starts\n//#vertex\nattribute vec3 aPosition;\nattribute vec3 aNormal;\nuniform mat4 uMatrix;\nuniform mat4 uViewMatrix;\nuniform mat4 uProjection;\nuniform mat3 uNormalMatrix;\nvarying vec3 vNormal;\nvoid main() {\n	vNormal = normalize(uNormalMatrix * aNormal);\n	gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);\n}\n//#fragment\nprecision mediump float;\nvarying vec3 vNormal;\nvoid main() {\n	gl_FragColor = vec4(vec3(0.5) + vNormal * 0.5, 1.0);\n}\n",

	/**
	 * @property standardLight
	 * 
	 * @description <p>A collection of light related functions</p> 
	 * 
	 * <p>Includes diffuse(), specular() and brightness()</p>
	 * 
	 * <a href='https://github.com/drojdjou/squareroot.js/tree/master/html/src/glsl/builtin/standardLight.glsl'>Shader source</a>
	 */
	"standardLight": "/*#docs*/\nvec3 diffuse(vec3 n, vec3 l, vec3 c, float i) {\n	#ifdef HEMISPHERE_DIFFUSE\n	return (dot(-l, n) * 0.5 + 0.5) * c * i;\n	#else\n	return max(0.0, dot(-l, n)) * c * i;\n	#endif\n}\nvec3 specular(vec3 n, vec3 v, vec3 l, vec3 c, float sh, float i) {\n	return pow(max(0.0, dot(reflect(-l, n), v)), sh) * c.rgb * i;\n}\nfloat brightness(vec3 c) {\n	return c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722;\n}\n",
};
