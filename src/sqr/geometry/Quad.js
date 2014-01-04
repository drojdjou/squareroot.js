SQR.Quad = function(t1, t2) {

    var that = this;

    this.normal = new SQR.V3();

    var perVertex = false;

    this.calculateNormal = function(_perVertex) {
        perVertex = _perVertex;
        t1.calculateNormal(_perVertex);
        t2.calculateNormal(_perVertex);
        that.normal.add(t1.normal, t2.normal).norm();
    }

    this.toArray = function(vertexArray, normalArray) {
        if(perVertex) {
            t1.toArray(vertexArray, normalArray);
            t2.toArray(vertexArray, normalArray);
        } else {
            t1.toArray(vertexArray);
            t2.toArray(vertexArray);
            
            if(normalArray) {
                var n = that.normal;
                normalArray.push(n.x, n.y, n.z);
                normalArray.push(n.x, n.y, n.z);
                normalArray.push(n.x, n.y, n.z);
                normalArray.push(n.x, n.y, n.z);
                normalArray.push(n.x, n.y, n.z);
                normalArray.push(n.x, n.y, n.z);
            }
        }
    }
}






