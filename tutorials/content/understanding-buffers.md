##Layouts

The concept of a buffer layout is derived from strides. Strides are an alternative way to organize data in WebGL buffers.

Typically every vertext attribute - such as position, normal or texture coordinate, is stored in a separate buffer. Stirdes allow to keep all the data in one biffer which is far more efficient. A stride represents all the attributes aligned one after the other in a pattern repeated as many times as the geometry has attributes.

For example let's take a buffer that has the following layout:
```
{ aPosition: 3, aColor: 3, aUV: 2 }
```
This means that each vertex has 3 attributes: 
- a position defined in 3d space as x, y, z coordinates
- a color defined as r, g, b values
- a uv coordinate defined in 2d textures space as u, v coordinate
SQR uses a convention for attribute naming. Every attribute name starts with a lowercase `a` followed by the camelCase name of the attribute. Some typical names include:
-`aPosition` the vertex position as 2d or 3d vector
-`aNormal` the vertex normal
-`aUV` the texture coordinate as a 2d vector
-`aColor` the vertex color, either as a 3-component vector (rgb) or 4-component (rgba)

After it is populated with data, the buffer array can look something like this:
```
[192, 82, 54, 0, 0.4, 1.0, 0.1, 0.2 ...]
```
The first 3 numbers are the position x, y, z `(192, 84, 54)`, the next 3 are the color `(0, 0.4, 1.0)` which defined a blue/green tint and the last two numbers represent the UV coordinte of this vertex. This pattern is repeated in the array for each vertext attribute. If the buffer has a size of 10 vertices, the array will have `(3 + 3 + 2) * 10 = 80` elements.

Typically a buffer is created this way:
```
var b = SQR.Buffer().layout({ aPosition: 3, aColor: 3 }, 1000);
```
This sets up an SQR.Buffer instance with the given layout and a size of 1000. The actual size

By default all the values in the buffer array are set to 0 and the WebGL buffer is NOT initialized, so rendering at this point will throw an error. Keep in mind this distinction: 
- SQR.Buffer instance is an instance of the SQR.Buffer class
- WebGL buffer is a WebGL buffer object crearted with `gl.createBuffer()`. This object is used to transfer vertex data to the GPU. SQR.Buffer create and updates a WebGL buffer internally with the `update` method. After any changes to the data in the SQR.Buffer, `update` needs to be called to upload the new data to the GPU.

##Data

If we just call `update` on the buffer above, all the vertices will be uploaded to the GPU with the value 0. Rendering will not throw any error and if you're lucky you will see a point at 0,0,0 coordinates. Of course this is not the point. There are several ways to populate the buffer with meaningful data. 

For generative geometry, one possible method is the `interate` function. Here's how this could work for the above buffer:
```
var v = new SQR.V3();
b.iterate('aPosition', function(i, data, c) {
// Get a random vector, normalize it and multiply by 50
v.random().norm().mul(50);
    data[i+0] = v.x;
    data[i+1] = v.y;
    data[i+2] = v.z;
});
```
This will populate the the buffer with points randomly distributed on a sphere with a 50 unit radius.

Another case is loading geometry data exported from 3d authoring tools. Let's take a simple JSON format as example:
```
var model = {
    "vertices": [-0.3934088,1.648787....],
    "normals": [-0.4570763,0.8326305,...],
    "uv1": [0.5373289,0.6876651,0.5373289...],
    "tris": [8182,1863,62,1862...]
}
```
It is composed of position (the `vertices` array), normals and texture coordinates (the `uv1` array). Typically meshes like this are indexed - the index values in this case are defined in the `tris` array. Indexed buffers are great for data optimization (even if they can be difficult to create manually), this is why most of the 3d authoring tools will export this way. 

Here's how simple it is to create a buffer with the data from the model above:
```
var b = SQR.Buffer()
    .layout(SQR.v3n3u2(), model.vertices.length / 3)
    .data('aPosition', model.vertices)
    .data('aNormal',  model.normals)
    .data('aUV',  model.uv1)
    .index(model.tris)
    .update();
```
Notice the `SQR.v3n3u2()` function call which is a shorthand for saying:
```
{ aPosition: 3, aNormal: 3, aUV: 2 }
```
This one and a few similar functions are available in the top-level `SQR` object.

##Drawing modes
Following OpenGL, WebGL offers several ways to draw a buffer on screen. Here's a quick list of the 5 most common ones:
- Triangles (`gl.TRIANGLES`) is the default mode for SQR.Buffer. It will take the vertex data by group of 3 and draw a triangle between those points. Note that the triangle must face the camera to be drawn unless face culling in set to off (`gl.disable(gl.FACE_CULL)`). This means that the triangle vertices when looked at from the point of view of the camera are in clockwise order.
- Lines (`gl.LINES`) will take vertices 2 by 2 and draw a line between them. This mean that for 4 vertices there will be 2 lines, for 6 - there will be 3 etc..
- Line strip ( `gl.LINE_STRIP`) will draw one continous line betwen all the vertices - 0 to 1, 1, to 2, 2, to 3
- Line loop (`gl.LINE_LOOP`) is similar to the line strip but it will close the loop by drawing a line between the last and the first vertex.
- Points (`gl.POINTS`) draws a point at the location of each vertex. The build-in GLSL variable `gl_PointSize` can be used to to define the size of the point in the vertex shader: `gl_PointSize = 10.0;`









