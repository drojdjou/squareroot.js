SQR.Mesh = function(path, onLoadFunc) {

    var that = this;

    var onLoaded = function(data) {
    	var ext = path.split('.').pop().toLowerCase();

    	switch(ext) {
    		case "obj":
    			SQR.OBJParser.parse(data, that);
    			break;
    		default: 
    			
    			throw "";
    	}

        that.dirty = true;
        that.vertexSize = 3;
        that.numVertices = that.vertices.length / that.vertexSize;

        if(onLoadFunc) onLoadFunc();
    }

    SQR.Loader.loadText(path, onLoaded);    
}