### Squareroot.js

A 2d/3d engine for WebGL and Canvas drawing and animation.

- [Github repo](https://github.com/drojdjou/squareroot.js/tree/brandnew)
- [API docs](http://sqr.bartekdrozdz.com/docs/)
- [Examples and tests](../html/lab/)

####Tutorial
- Getting Started tutorial {@tutorial basic-setup}
- Bone Export Tutorial {@tutorial bone-export}

####Other interesting WEbGL links
- [WebGL Spec](https://www.khronos.org/registry/webgl/specs/latest/1.0/)
- [WebGL Params](http://alteredqualia.com/tmp/webgl-maxparams-test/)

Guide:

####GL 
- {@link SQR.Transform} - basic building block. A transform is a point in space that has rotation, position and scale.
- {@link SQR.Buffer} - holds buffers & geometries, see {@tutorial understanding-buffers}
- {@link SQR.Shader} - utility to compile and execute GLSL shaders, see {@tutorial understanding-shaders}
- {@link SQR.Texture} - create textures from images, vides and canvas elements
- {@link SQR.Cubemap} - similar functionality as the texture, but for cubemaps
- {@link SQR.Primitives} - a collection of functions to create basic geometries like cube, sphere, etc...

####Canvas 2d
- {@link SQR.Transform2d} - similar to the 3d transform above, but optimized for rendering on canvas and in 2d instead of webgl/3d
- {@link SQR.CanvasRenderer} - a renderer to draw shapes on a 2d context. For a tutorial see {@tutorial canvas-rendering}

####Math
- {@link SQR.V2} - a 2d vector
- {@link SQR.V3} - a 3d vector
- {@link SQR.Quaternion} - a quaternion
- {@link SQR.Matrix2D} - a 2d matrix
- {@link SQR.Matrix44} - a multipurpose 4x4 matrix
- {@link SQR.Matrix33} - a 3x3 matrix for rotations/normals
- {@link SQR.ProjectionMatrix} - a 4x4 matrix specialized for creating projection matrices
- {@link SQR.Bezier} - a quadratic bezier implementations
- {@link SQR.Spline} - a spline: multiple line segments smoothed with bezier function

####Animation
*THIS WILL BE DEPRECATED SOON, USE TweenLite INSTEAD*
- {@link SQR.Anm} - a tiny animation/tweening enging
- {@link SQR.Animation} - a class that represetns an animation
- {@link SQR.Tween} - a tween is an animation applied to an object

