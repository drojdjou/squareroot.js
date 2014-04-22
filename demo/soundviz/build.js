var fs = require('fs');
var UglifyJS = require("uglify-js");

console.log("Compressing javascript...");

var data = {
	baseUrl: "", 
	out: "soundviz-min.js", 
	include: [		
		"js/Key.js",
		"js/Menu.js", 
		"js/LeapWrapper.js", 
		"js/audio/SoundAnalyser.js", 
		"js/audio/SoundVisualizer.js", 
		"js/VisualizerCollection.js", 
		"js/EffectCollection.js", 
		"js/effects/Vignette.js", 
		"js/effects/Blur.js", 
		"js/effects/GlowChromaticDist.js", 
		"js/effects/ScanLines.js", 
		"js/effects/NoEffect.js", 
		"js/objects/StrechingCube.js", 
		"js/objects/LineSphere.js", 
		"js/objects/SkyscraperLane.js",
		"js/objects/Gems.js", 
		"js/objects/Pyramids.js", 
		"js/geometry/LineSphereGeometry.js", 
		"js/geometry/Skyscraper.js", 
		"js/geometry/Freeway.js",
		"js/main.js"
	]
};

var includes = [];

for(var i = 0; i < data.include.length; i++) {
	includes.push(data.baseUrl + data.include[i]);
}

var result = UglifyJS.minify(
	includes
);

fs.writeFileSync(data.out, result.code);

console.log("...done!");







