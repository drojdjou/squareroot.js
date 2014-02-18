/**
 *  @class
 */
SQR.Triangle = function(options) {

    this.size = 3;

    var makeABC = function(a, b, c) {
        return {
            a: a, b: b, c: c
        }
    }

    var data = {};
    var normal = new SQR.V3();

    this.setVertices = function(vertexA, vertexB, vertexC) {
        this.setAttribute(SQR.Geometry.VERTEX, vertexA, vertexB, vertexC);
    }

    this.setAttribute = function(name, valueA, valueB, valueC) {
        data[name] = makeABC(valueA, valueB, valueC);
    }

    this.data = function(name) {
        return data[name];
    }

    // TODO: implement
    this.setElements = function(indexA, indexB, indexC, values) {

    }

    this.setAttributeElements = function(name, indexA, indexB, indexC, values) {

    }
    //

    this.calculateNormal = function() {
        // if(options.perVertextNormals)

        var a = SQR.VectorUtil.__tv1;
        var b = SQR.VectorUtil.__tv2;
        var c = SQR.VectorUtil.__tv3;

        var vs = data[SQR.Geometry.VERTEX];

        a.sub(vs.b, vs.a);
        b.sub(vs.c, vs.a);
        normal.cross(a, b).norm();

        this.setAttribute(SQR.Geometry.NORMAL, normal, normal, normal);
    }

    this.reverseNormal = function() {

    }

    var valueToArray = function(value, array) {
        if(!value) return;
        if(value.toBuffer) value.toBuffer(array);
        else if(value instanceof Array) array.push.apply(array, value);
        else if(!isNaN(value * 2)) array.push(value);
        else throw "Vertex attribute " + name + " has some invalid values: " + value;
    }

    this.toArray = function(name, array) {
        var d = data[name];
        if(!d) throw "Unknown attribute requested on triangle: " + name.toString();
        valueToArray(d.a, array);
        valueToArray(d.b, array);
        valueToArray(d.c, array);
    }

    this.toElements = function(elementsArray) {

    }
}






