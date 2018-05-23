
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


##### v3.0 b 154
*Mar 11th 2016*

Adding custom mouse position param to Pointer3d.fromMousePosition


##### v3.0 b 155
*Mar 29th 2016*

Shader is not mandatory when creating a postEffect


##### v3.0 b 172
*Apr 20th 2016*

Fix for multi-context cases

##### v3.0 b 175
*Jun 2nd 2016*

Removing gloabl fullscreenquad in PostEffect


##### v3.0 b 176
*Jun 22nd 2016*

Adding Matrix2D to Kuula build


##### v3.0 b 177
*Jun 22nd 2016*

Adding Framebuffer to Kuula build


##### v3.0 b 178
*Jun 22nd 2016*

Adding texture config options to FrameBuffer


##### v3.0 b 179
*Jul 18th 2016*

AddingCube to Kuula build


##### v3.0 b 180
*Aug 17th 2016*

Not adding listener to Gyro on start (lazy add instead) + added 'two' package to Kuula build


##### v3.0 b 181
*Aug 17th 2016*

Adding resolution parameter to CanvasRenderer.setSize


##### v3.0 b 182
*Aug 18th 2016*

/


##### v3.0 b 183
*Aug 18th 2016*

/


##### v3.0 b 184
*Aug 18th 2016*

/


##### v3.0 b 185
*Aug 18th 2016*

/


##### v3.0 b 186
*Aug 18th 2016*

/


##### v3.0 b 187
*Aug 18th 2016*

/


##### v3.0 b 188
*Aug 18th 2016*

/


##### v3.0 b 189
*Aug 18th 2016*

/


##### v3.0 b 190
*Aug 30th 2016*

Fixing texture creating in FrameBuffer


##### v3.0 b 191
*Aug 30th 2016*

Fixing texture creating in FrameBuffer [2]


##### v3.0 b 194
*Oct 29th 2016*

Adding texture premul alpha setting



##### v3.0 b 195
*Oct 29th 2016*

Adding context destroy function


##### v3.0 b 196
*Oct 29th 2016*

Trying to figure out the texture errors in FF


##### v3.0 b 197
*Nov 2nd 2016*

Testing different texture formsts for an iOS bug


##### v3.0 b 198
*Nov 2nd 2016*

Adding one option to FrameBuffer to leave all binded after creation


##### v3.0 b 199
*Nov 2nd 2016*

Testing different texture formsts for an iOS bug [2]


##### v3.0 b 200
*Mar 7th 2017*

Fixing Gyro to work ok on Desktops with no actual gyroscope


##### v3.0 b 208
*Apr 28th 2017*

Fixing a bug in Gyro on hybrind screens


##### v3.0 b 209
*Apr 28th 2017*

Fixing a bug in Gyro on hybrind screens


##### v3.0 b 211
*Oct 18th 2017*

Adding premultiply alpha option to textures


##### v3.0 b 212
*Oct 18th 2017*

Fixing bug where options passed to constructor would be ignored in textures with no source


##### v3.0 b 213
*Oct 18th 2017*

Adding Face to Kuula build


##### v3.0 b 214
*Oct 18th 2017*

Adding PLane insteas of Face to Kuula build


##### v3.0 b 215
*Oct 19th 2017*

Matrix after lookAt was not correctly preserving scale


##### v3.0 b 216
*Oct 25th 2017*

Enabling Gyro to accept external data


##### v3.0 b 217
*Oct 25th 2017*

Enabling Gyro to accept external data


##### v3.0 b 218
*Oct 30th 2017*

Adding collider and intersection to Kuula build


##### v3.0 b 219
*Dec 1st 2017*

Color CSS value now returns alpha


##### v3.0 b 220
*Dec 1st 2017*

Removed an annoying warning in Texture re; mipmaps


##### v3.0 b 221
*Dec 1st 2017*

Turns out that Color stuff was a bit more tricky


##### v3.0 b 222
*Feb 26th 2018*

Small fix to SceneParser


##### v3.0 b 223
*Feb 26th 2018*

Including scene folder in the main build


##### v3.0 b 224
*Mar 14th 2018*

Adding a few more methods to the Color object


##### v3.0 b 230
*Mar 15th 2018*

Added one more check in context creation


##### v3.0 b 231
*Mar 21st 2018*

Adding frequency control to Gyro (related to Android Chromium bug)


##### v3.0 b 241
*May 7th 2018*

Added getParameter function to Texture and FrameBuffer


##### v3.0 b 247
*May 22nd 2018*

Fixed issue with Marth.clamp when start was > than end

