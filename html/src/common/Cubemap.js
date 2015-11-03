/**
 *  @class Cubemap
 *  @memberof SQR
 *
 *  @descrption A cubemap texture is used for texturing reflections, skyboxes and similar effects. If your shader expects a cubemap uniform use this object to create one.
 *  @param faces {Object} 6 paths to the textures for each face.
 *  @param faces.up {string} the path to the image for the face up
 *  @param faces.down {string} the path to the image for the face down
 *  @param faces.left {string} the path to the image for the face left
 *  @param faces.right {string} the path to the image for the face right
 *  @param faces.back {string} the path to the image for the face back
 *  @param faces.front {string} the path to the image for the face front
 *
 *  @param params {object} parameter for the texture
 *  @param params.onLoad {function} a callback to call when all the images are loaded 
 */
SQR.Cubemap = function(faces, params) {

    var c = {};
    c.tex = SQR.gl.createTexture();

    var facesLeft = 6;
    var faceImages = {};

    params = params || {};

    var onLoad = function() {

    	var gl = SQR.gl;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, c.tex);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceImages.right);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceImages.left);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceImages.up);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceImages.down);

        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceImages.front);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, faceImages.back);

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        var wrapS = params.wrapS || params.wrap || gl.CLAMP_TO_EDGE;
        var wrapT = params.wrapT || params.wrap || gl.CLAMP_TO_EDGE;

        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, wrapT);

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

        if (params.onLoad) params.onLoad();
    }

    var onFace = function() {
        facesLeft--;
        if (facesLeft <= 0) onLoad();
    }

    var load = function(name, src) {

        if (typeof(src) == "string") {
            faceImages[name] = new Image();
            faceImages[name].onload = onFace;
            faceImages[name].src = src;
        } else if (src instanceof Image || !!src.getContext) {
            faceImages[name] = src;
            onFace();
        }
    }

    if (faces.left) {
        load("left", faces.left);
        load("right", faces.right);
        load("up", faces.up);
        load("down", faces.down);
        load("back", faces.back);
        load("front", faces.front);
    } else if(faces) {
        load("left", faces);
        load("right", faces);
        load("up", faces);
        load("down", faces);
        load("back", faces);
        load("front", faces);
    }

    return c;
}