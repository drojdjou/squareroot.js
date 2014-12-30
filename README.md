### Squareroot.js

A 2d/3d engine for WebGL and Canvas drawing and animation.

For a "Getting Started" tutorial see {@tutorial basic-setup}

Guide:

####GL 
- {@link SQR.Transform} - basic building block. A transform is a point in space that has rotation, position and scale.
- {@link SQR.Buffer} - holds buffers & geometries, see {@tutorial understanding-buffers}
- {@link SQR.Buffer} - utility to compile and execute GLSL shaders, see {@tutorial understanding-shaders}
- {@link SQR.Texture} - create textures from images, vides and canvas elements
- {@link SQR.Cubemap} - similar functionality as the texture, but for cubemaps
- {@link SQR.Primitives} - a collection of functions to create basic geometries like cube, sphere, etc...

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

