SQR.TextureSplitter = {

	apply: function(source, destination, width, ctx) {

		

		var ow = source.width;
		var oh = source.height;

		var scale = width / ow;
		console.log(scale);

		destination.width =  ow * scale;
		destination.height = oh * scale;

		ctx.drawImage(source, 0, 0, ow, oh, 0, 0, ow * scale, oh * scale);

	}

};