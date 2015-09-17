### Bone Export HOWTO

#### Software
Cinema4d 11.5
Unity 5
WebGL

#### Modeling / rigging

1. Create 3d model.
2. Flatten the mesh (aka Current State to Object) and the clean it up from empties and merge meshes if it produces more than one.
3. Menu > Character > Joint and create the hierarchy
4. back to the model, add tag Character Tags > Weight and add all the joints to the properties.
5. Click Set Pose and Auto Weight in the tag properties
6. Add skin under the model in hierarchy (Menu > Character > Skin)
7. If you need to chabge the bone strucotre, select Clear Weights in tag proeprties and siabled Skin (click the green checkmark in Objects panel)
8. If adding more bones, remember to add the to the list in the Weight tag properties
9. When done, export to FBX and move over to Unity5

### Unity5 exporting

1. Do a sanity check (see if all joint work fine)
2. Disable all the mess and Null Objects
3. Fine tune the import setting (scale, normals, etc...)
4. Select the object and J3D > Export

### WebGL / Squareroot

1. Sanity check again (are boneWeights and boneIndices in the mesh, is the bone struture in the scene file)
2. Import the JSON files
3. Remember that if the scene doesn't have a camera, you'll need to create one including a projection setting ;)
4. The shader needs to use the bones.glsl include and the a`Position` and `aNormal` attributes need to be passed to the `bones` function, like this:

```
//#include bones
...
vec3 p = bones(aPosition);
vec3 n = bones(aNormal);
```
