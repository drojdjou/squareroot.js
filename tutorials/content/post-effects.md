##What are post effets?

There is a common misconception that post effect are a special/separate feature of WebGL. This is not the case. A post effect is basically a shader applied to a full screen quad - a plane that covers the entire screen. It can be applied for example to a 3d scene, an image or video.

The most powerful post effects can be achived by combining several shaders and rendering them one after the other - which is typically called a pass.

For example, rendering the blur effect below requires 3 passes:
- render the 3d scene to a texture
- the first blur pass to blur along the X axis
- the second blur pass to blur along the Y axis

.....

####The rest of the tutorial is coming soon! 

Meanwhile enjoy this [simple example](../tutorials/post-effect.html) of a blur effect.

