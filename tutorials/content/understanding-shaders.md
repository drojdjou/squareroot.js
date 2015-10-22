Shaders are fundamental building blocks for WebGL rendering. SQR does not provide any functionality similar to materials in other engines. Anything that is rendered on screen requires a custom shader. SQR does however include several features that make writing shaders easier, such as a rendering pipeline that sets up all the buffers and some built-in uniforms.

## Sample shader
Let's take a simple shader and analyze it step by step.

```
// normal2color.glsl
//#vertex
attribute vec3 aNormal;
attribute vec3 aPosition;

uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;

varying vec3 vNormal;
     
void main() {
    vNormal = normalize(uNormalMatrix * aNormal);
    gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
}

//#fragment
#ifdef GL_ES
precision highp float;
#endif
               
varying vec3 vNormal;
           
void main() {
    gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);
}
```

First of all, in SQR the shader is typically defined in a separate file with an GLSL extension. This file contains both the vertext and the fragment shaders. Special comment format is used to instruct the the SQR shader compiler where the code for each shader is located.

###Comments and SQR instructions
Regular 1-line comments are allowed in GLSL files. Multiline comments are not supported, but a series of signle line comments will do the job ;) 
```
// A single line comment
vec3 n = aNormal; // An inline comment
```
SQR expects to find two special comments:
```
//#vertex
```
that marks the begining of the vertex shader and 
```
//#fragment
```
that, as expected, marks the begining of the fragment shader code. 

*Mark that there is no space in those inscturtions. Inserting a space anywhere will make the compiler miss this instruction.*

By convention vertex shader code comes first, but it's not mandatory. Another special SQR instruction supported are includes:
```
//#include lightingFunctions
```
Includes are a powerful feature that allow shader code reuse. The way incldes for is that the compiler will look for a chunk of code stored under thename of the include (in the example above `lightingFunctions`) in two places:

- in a global object called `SQR.GLSL`. In this case the incude will need to reside in a property `SQR.GLSL.lightingFunctions`
- in the global list of assets loaded with `SQR.Loader`. This method will be deprecated soon though, so don't get used to it.

###Atributes
The vertex shader starts with a declaration of attributes that the shader expects:
```
attribute vec3 aNormal;
attribute vec3 aPosition;
```
In this case, the shader expects a geometry that has a 3d vector attribute for position and another one that defines a normal. It's important to understand that this shader will only work with a SQR.Buffer with a layout that defines those attributes in the same way. The buffer can have more attributes, ex. a set of UV coordinates and the shader does not have to make use of those. 

During the rendering process, the engine will set the shader and the buffers ready ti be consumed in the the shader.

###Uniforms

Uniforms are variables that are set in a shader and used during drawing. They remain constan for every vertex within a single draw call, hence the name. Uniform can define a lot of properties of an object. In fact, a lot of material properties in any 3d software, such as color, shininness, light position, texture etc... would be uniforms in a context of a shader - so it's ok to think of uniforms as sort of 'material properties'.

A uniform can be defined in either the vertex shader or the fragment shader of both and it's definition looks like this:

```
uniform vec3 uColor;
```

This way the uniform variable uColor can be used inside the vertex or fragment functions.

The values of the uniforms need to be set in Javascript. There are two ways of doing it. 

First method is setting the value directly, using the `SQR.Shader.setUniform()` method (see `SQR.Shader` docs for details). This method is best for values that are either constant at all time or do not change for every object that is render using this shader. Imagine you have a hundred 3d objects all using the same texture or all lit but the same light - this are cases where `setUniform()` come in handy.

In another scenario, you might have a hundred balls bouncing in your scene, and each ball would have a different color even thoug the all use the same shader (which is always a good idea - use as few shader as you can!). 

In this case, it's easire to set the uniform per object, not per shader. This can be done by adding a `uniforms` property to an instance of `SQR.Transform`:

```
var commonShader = SQR.Shader(shaderCode);
var ballMesh = SQR.Primitives.createSphere(2);
var root = new SQR.Transform();

for(var i = 0; i < 100; i++) {
    var t = new SQR.Transform();
    t.shader = commonShader;
    t.buffer = ballMesh;
    t.uniforms = { uColor: [Math.random(), 0, 0] };
    root.add(t);
}
```

This code will create 100 balls and each will have a different tone of red color. Keep in mind the the `SQR.Transform` does not have a `uniforms` property by default. If you want to use it, you need to make one.

###Built-in uniforms
SQR offers a set of built in uniforms:
```
uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
uniform float uTime;
uniform vec3 uEyePosition;
```
The uniforms are:
- `uMatrix` - object to world matrix
- `uViewMatrix` - object to view matrix. The view matrix is a matrix where the camera is located at the center of the coordinate space facing forward. If the camera object is not moved anywhere in the scene from it's default position, the global and view matrices will be the same. This is also the case if the scene is rendered without a camera, which is common in orgothraphic or 2d rendering.
- `uProjection` - projection matrix
- `uNormalMatrix` - object to worls normal matrix. This normal matrix transforms the normal from the object space into the world space (not view space).
- `uTime` - the time elapsed since rendering started. Useful to shader-based animations
- `uEyePosition` - the position of the camera in world space

A typical shader for a 3d mesh will do the following transformations in the vertex shader:
```
vNormal = normalize(uNormalMatrix * aNormal);
gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
```
First, the normal is multiplied by the normal matrix and assigned to a varying (see below for varyings). The resulting vector is normalized to make sure it's fit for light/color calculations in the fragment shader (if the normals are normalized in JS, this step is not necessary).

The position is first multiplied by the view matrix, to bring the position from object space to view space. Then we multiply the vertex by the projection matrix to bring it into the clip space. The rest of the job, i.e. figuring out the screen space coordinates is handled by the WebGL rendering pipeline.

Notice that the matrices require a 4 component vector for multiplication, but typically the position is defined in 3 component vectors. The is why a 4th component `w` is added before the operation. It should always be equal to `1.0`.

###Varyings

Varyings are variables passed from the vertex shader to the fragment shader. They are declared before the shader main function, ex. like this:
```
varying vec3 vNormal;
```
Notice that the same varying needs to be declared twice: in the vertex and in the fragment shader, otherwise the shader compiler will throw an error.

###Fragment color 

The single purpose of the fragment shadetr is to calculate the color the current fragment - which is a fancy GL term for pixel (not quite, but it's good enough explanation for this purpose).

Our simple shader takes the vertex normal value from the varying `vNormal` and derives a pixel color from it. 
```
gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5), 1.0);
```
The little bit of offseting math is to make sure all face color values are positive even if the normal is facing in the negative direction.








