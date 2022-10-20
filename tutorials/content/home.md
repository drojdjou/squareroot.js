### Squareroot.js

A 2d/3d engine for WebGL and Canvas drawing and animation. 

#### Most important links

- [Home page](http://sqr.holotype.co)
- [Github repo](https://github.com/drojdjou/squareroot.js/)
- [Examples and tests](../html/lab/)

#### Tutorials

- Getting Started tutorial {@tutorial basic-setup}
- Understanding buffers {@tutorial understanding-buffers}
- Understanding shaders {@tutorial understanding-shaders}
- Post effects {@tutorial post-effects}
- 2d Canvas Rendering {@tutorial canvas-rendering}
- C4D/Unity Bone Export HOWTO {@tutorial bone-export}

#### Workshops

If you are running a web development company and would like me to come and make a presentation or workshop on WebGL, get in touch! Here is a sample presentation [WebGL basics presentation](../tutorials/gl-basics.html). 

####Other interesting WebGL links

- [WebGL Spec](https://www.khronos.org/registry/webgl/specs/latest/1.0/)
- [WebGL Params](http://alteredqualia.com/tmp/webgl-maxparams-test/)

Guide:

#### GL 

Core WebGL rendering classes.

- {@link SQR.Transform} - basic building block. A transform is a point in space that has rotation, position and scale.
- {@link SQR.Buffer} - holds buffers & geometries, see {@tutorial understanding-buffers}
- {@link SQR.Shader} - utility to compile and execute GLSL shaders, see {@tutorial understanding-shaders}
- {@link SQR.Texture} - create textures from images, vides and canvas elements
- {@link SQR.Cubemap} - similar functionality as the texture, but for cubemaps
- {@link SQR.Primitives} - a collection of functions to create basic geometries like cube, sphere, etc...
- {@link SQR.Mesh} - utility to import meshes from Unity (J3D JSON format)

####Canvas 2d

Canvas 2d rendering engine. See {@tutorial canvas-rendering} for details.

- {@link SQR.Transform2d} - similar to the 3d transform above, but optimized for rendering on canvas and in 2d instead of webgl/3d
- {@link SQR.CanvasRenderer} - a renderer to draw shapes on a 2d context
- {@link SQR.SpriteSheet} - a utility to create sprite sheets for animation

#### Math

All the math classes, incuding vectors, matrices and some other goodies.
    
- {@link SQR.Color} - an RGB color
- {@link SQR.V2} - a 2d vector
- {@link SQR.V3} - a 3d vector
- {@link SQR.Quaternion} - a quaternion
- {@link SQR.Matrix2D} - a 2d matrix
- {@link SQR.Matrix44} - a multipurpose 4x4 matrix
- {@link SQR.Matrix33} - a 3x3 matrix for rotations/normals
- {@link SQR.ProjectionMatrix} - a 4x4 matrix specialized for creating projection matrices
- {@link SQR.Bezier} - a quadratic bezier implementations
- {@link SQR.Spline} - a spline: multiple line segments smoothed with bezier function
- {@link SQR.Delaunay} - delaunay triangulation utility

#### VR

Highly experimental classes that should help build web based VR expriences.

- {@link SQR.VRApp} - a helper class to create universal VR Apps
- {@link SQR.VRPost} - a VR stereo post effect
- {@link SQR.Gyro} - a gyroscope handler

#### Extras

Misc stuff. Some real gems can be found in here!

- {@link SQR.GeometryTools} - a collection of functions to deal with buffer and geometries
- {@link SQR.Trackball} - a quaternion based 3d trackball control
- {@link SQR.ConvexHull} - a utility to calculate a convex hull
- {@link SQR.PerlinTexture} - a utility to genrate Perlin noise based textures

