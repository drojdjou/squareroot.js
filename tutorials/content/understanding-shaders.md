Shaders are fundamental building blocks for WebGL rendering. SQR does not provide any functionality similar to materials in other engines by default. Anything that is rendered on screen requires a shader to be writtedn by the user. It does however include several features that make writing shaders easier, such as a rendering pipeline that sets up allt the buffers and some built-in uniforms.

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
//#include ~light/sphar.glsl
```
Our simple shader above does not use includes, but it is a powerful feature (see below for a discussion on includes.

###Atributes
The vertex shader starts with a declaration of attributes that the shader expects:
```
attribute vec3 aNormal;
attribute vec3 aPosition;
```
In this case, the shader expects a geometry that has a 3d vector attribute for position and another one that defines a normal. It's important to understand that this shader will only work with a SQR.Buffer with a layout that defines those attributes in the same way. The buffer can have more attributes, ex. a set of UV coordinates and the shader does not have to make use of those. 

During the rendering process, the engine will set the shader and the buffers ready ti be consumed in the the shader.

###Built-in uniforms
SQR offers a set of built in uniforms:
```
uniform mat4 uMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjection;
uniform mat3 uNormalMatrix;
```
The uniforms are:
- `uMatrix` - object to world matrix
- `uViewMatrix` - object to view matrix. The view matrix is a matrix where the camera is located at the center of the coordinate space facing forward. If the camera object is not moved anywhere in the scene from it's default position, the global and view matrices will be the same. This is also the case if the scene is rendered without a camera, which is common in orgothraphic or 2d rendering.
- `uProjection` - projection matrix
- `uNormalMatrix` - object to view normal matrix. This normal matrix transforms the normal from the object space directly into the view space, not world space. This actually makes light calculations easier, especially wit the specular component where the position of the camera matters. However, this is not a typical setup so make sure you modify the shader code if you copy from a tutorial.

A typical shader for a 3d mesh will do the following transformations in the vertex shader:
```
vNormal = normalize(uNormalMatrix * aNormal);
gl_Position = uProjection * uViewMatrix * vec4(aPosition, 1.0);
```
First, the normal is multiplied by the normal matrix and assigned to a varying (see below for varyings). The resulting vector is normalized to make sure it's fit for light/color calculations in the fragment shader (not sure if this is 100% necessary).

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

## Includes
Includes allow to reuse parts of shader code. It is based on preprocessing, so includes can be inserted anywhere in the code and contain any part of the code as long as the resulting, concatenated code is valid.








