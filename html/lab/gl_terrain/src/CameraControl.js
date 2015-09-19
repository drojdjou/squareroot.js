SQR.CameraControl = function(holder, camera) {

	var rotYTarget = 0, offsetX = 0;
	var active = false, startX = 0;
	var posXTarget = holder.position.x;
	var posZTarget = holder.position.z;
	var posYTarget = holder.position.y;
	var rotXTarget = 0;

	document.addEventListener('mousemove', function(e) {
		offsetX = startX - (e.pageX / window.innerWidth);
	});

	document.addEventListener('mousedown', function(e) {
		startX = e.pageX / window.innerWidth;
		active = true;
	});

	document.addEventListener('mouseup', function() {
		active = false;
	});

	document.addEventListener('keydown', function(e) {
		switch(e.keyCode) {
			case 81:
				posYTarget += 0.5;
				break;
			case 65:
				posYTarget -= 0.5;
				break;

			case 38:
				posZTarget -= 0.5;
				break;
			case 40:
				posZTarget += 0.5;
				break;

			case 37:
				posXTarget -= 0.5;
				break;
			case 39:
				posXTarget += 0.5;
				break;


			case 80:
				rotXTarget -= 0.05;
				break;
			case 76:
				rotXTarget += 0.05;
				break;


			default:
				console.log(e.keyCode);
				break;
		}
	});

	var run = function() {

		if(active) rotYTarget += offsetX * 0.1;
		requestAnimationFrame(run);
		camera.rotation.x += (rotXTarget - camera.rotation.x) * 0.1;
		holder.rotation.y += (rotYTarget - holder.rotation.y) * 0.1;
		holder.position.x += (posXTarget - holder.position.x) * 0.1;
		holder.position.z += (posZTarget - holder.position.z) * 0.1;
		holder.position.y += (posYTarget - holder.position.y) * 0.1;
	}

	run();
}