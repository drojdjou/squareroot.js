
##### v3.0 b 99
*Mar 27th 2015*

Added this very Changelog file


##### v3.0 b 100
*Mar 31st 2015*

Added forward vector to Transform


##### v3.0 b 102
*Mar 31st 2015*

Shader.setUniform returns shader instance even if the uniform was not found - to avoid obsure errors


##### v3.0 b 103
*Apr 2nd 2015*

Added height inversion to V3.toScreenSpace


##### v3.0 b 104
*Apr 2nd 2015*

Adding option to slightly oversize skyboxes - maybe will help with seams on video files?


##### v3.0 b 105
*Apr 2nd 2015*

The previous update was a bad idea...


##### v3.0 b 106
*Apr 17th 2015*

Adding Quaternion.dot (static), quaternion.neg and a trick in slerp to make it always choose the shortest distance


##### v3.0 b 108
*Apr 17th 2015*

Unroll previous trick in Quaternion.slerp


##### v3.0 b 109
*Apr 17th 2015*

Texture does not generate mipmaps by default now, option mipmap=true needs to be specified


##### v3.0 b 110
*Apr 17th 2015*

Fix on Texture filtering related to mimpap setting above


##### v3.0 b 111
*Apr 18th 2015*

Adding that Quaternion.slerp trick, with a fix. This time hopefully it works!


##### v3.0 b 112
*May 6th 2015*

Creating a separate build for two+math


##### v3.0 b 113
*May 6th 2015*

CanvasRenderer can now be called without root (will just clear the canvas)


##### v3.0 b 114
*May 12th 2015*

CanvasRenderer will now clear correctly even with alpha in background


##### v3.0 b 115
*May 15th 2015*

Adding reversing normals option to icosphere


##### v3.0 b 116
*May 29th 2015*

name parameter was missing in Transform2d


##### v3.0 b 117
*Aug 8th 2015*

Adding SceneParser to primitives


##### v3.0 b 118
*Aug 8th 2015*

Adding perQuadUV option to plane contructor in primitives


##### v3.0 b 119
*Aug 12th 2015*

Adding small settings to Renderer and Plane + new demo


##### v3.0 b 123
*Sep 18th 2015*

Removing extras bucket, adding vr


##### v3.0 b 124
*Oct 6th 2015*

Adding Math.map


##### v3.0 b 125
*Oct 7th 2015*

Cleaning the Texture class a bit, update to API (all backwards compatible btw)


##### v3.0 b 128
*Oct 15th 2015*

Removing GLSL compilation from build process


##### v3.0 b 131
*Oct 16th 2015*

Added toCSS and lerp to SQR.Color


##### v3.0 b 132
*Oct 18th 2015*

Changing how disabling depth works in Transform. Not the entire DEPTH_TEST is disabled, not just the depth mask


##### v3.0 b 133
*Oct 27th 2015*

Very important: the welcome console message is now in color :)


##### v3.0 b 136
*Oct 29th 2015*

Started reworking the mesh creation functions (aka Primitives)


##### v3.0 b 137
*Nov 2nd 2015*

Changes in Renderer/Context classes and new Mesh API


##### v3.0 b 149
*Nov 9th 2015*

Adding builtin shaders


##### v3.0 b 150
*Nov 10th 2015*

Realizing that we need to rewrite the SceneParser from scratch. Otherwise, some minor fixes


##### v3.0 b 153
*Jan 29th 2016*

Recovering updates [1]

