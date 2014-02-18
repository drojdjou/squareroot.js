SQR.Vertex = function() {

	var data = [];
	this.size = 0;
	this.attr = {};
	this.layout = [];

	this.add = function(name, value) {
		if((!value.size || !value.toBuffer) && isNaN(value)) 
			throw("Illegal value for vertex attribute. Must be an object with property 'size' and 'toBuffer' function or a number: " + value);

		data.push(value);
		this.attr[name] = value;
		this.size += value.size || 1;
		this.layout.push({ name:name, size:value.size || 1 });

		// Make shortcuts for standard attributes
		switch(name) {

			case SQR.Vertex.POSITION: 
				this.position = value;
				break;

			case SQR.Vertex.NORMAL: 
				this.normal = value;
				break;

			case SQR.Vertex.TEXCOORD: 
				this.texcoord = value;
				break;

			case SQR.Vertex.TEXCOORD2: 
				this.texcoord2 = value;
				break;

			case SQR.Vertex.TANGENT: 
				this.tangent = value;
				break;

			case SQR.Vertex.COLOR: 
				this.color = value;
				break;

			default:
				
				break
		}

		return this;
	}

	this.toBuffer = function(buffer, index) {

		var dl = data.length, s = 0;
		for(var i = 0; i < dl; i++) {

			if(data[i].toBuffer) {
				data[i].toBuffer(buffer, index + s);
				s += data[i].size;
			} else {
				buffer[index + s] = data[i];
				s += 1;
			}
		}

		return s;
	}
}

SQR.Vertex.POSITION = 	"aPosition";
SQR.Vertex.NORMAL = 	"aNormal";
SQR.Vertex.TEXCOORD = 	"aTexCoord";
SQR.Vertex.TEXCOORD2 = 	"aTexCoord2";
SQR.Vertex.TANGENT = 	"aTangent";
SQR.Vertex.COLOR = 		"aColor";






