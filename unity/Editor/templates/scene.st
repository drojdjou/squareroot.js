{
	
"path" : "",
"ambient": { "r":$ambient.r$, "g":$ambient.g$, "b":$ambient.b$, "a":$ambient.a$ },
"background": { "r":$background.r$, "g":$background.g$, "b":$background.b$, "a":$background.a$ },

"quaternions":$if(quaternions)$ true$else$ false$endif$,

$if(exportTextures)$"textures": {
$textures:{	
	"$it.Name$": { 
		"file": "$it.FileName$"
	},
}$
},$endif$

"lightmaps": [
$lightmaps:{
	"$it.FileName$",
}$
],
	
"materials": {
$materials:{	
	"$it.Name$": { 
		"type": "$it.Type$",
		"uColor": { "r":$it.Color.r$, "g":$it.Color.g$, "b":$it.Color.b$ },
		$if(exportTextures)$
		$if(it.HasMainTexture)$
		"uTexture": "$it.MainTexture$",
		"uTextureTileOffset": [ $it.TextureScale; separator=","$,$it.TextureOffset; separator=","$ ]
		$endif$
		$endif$
	},
}$
},

"lights": {
$lights:{	
	"$it.Name$": { 
		"type": $it.Type$,
		"color": { "r":$it.Color.r$, "g":$it.Color.g$, "b":$it.Color.b$, "a":$it.Color.a$ },
		"intensity": $it.Intensity$,
		$if(it.IsSpot)$
		"angle": $it.Angle$,
		"angleFalloff": $it.FalloffAngle$,$endif$
	},
}$
},

"cameras": {
$cameras:{	
	"$it.Name$": { 
		"fov": $it.FOV$,
		"near": $it.Near$,
		"far": $it.Far$
	},
}$
},

"transforms": [
$transforms:{	
	{
		"uid": "$it.UID$",
		"name": "$it.name$",
		$if(it.HasParent)$
		"parent": "$it.Parent$",$endif$
		"position": [ $it.Position; separator=","$ ],
		"rotation": [ $it.Rotation; separator=","$ ],
		$if(it.HasScale)$
		"scale": [$it.Scale; separator=","$],$endif$
		$if(it.HasAnimation)$
		"animation": "$it.AnimationName$",
		"animationId": "$it.AnimationId$",$endif$
		$if(it.HasCollider)$
		"collider": {
			"type": "$it.Collider.Type$",
			$if(it.Collider.HasCenter)$
			"center": [ $it.Collider.Center; separator=","$ ],$endif$
			$if(it.Collider.HasSize)$
			"size": [ $it.Collider.Size; separator=","$ ],$endif$
			$if(it.Collider.HasRadius)$
			"radius": $it.Collider.Radius$,$endif$
			$if(it.Collider.HasMesh)$
			"mesh": "$it.Collider.MeshName$",$endif$
		},$endif$
		$if(it.HasBones)$
		"bones": ["$it.Bones; separator="\",\""$"],
		"bindposes": [ $it.BindPoses; separator=","$ ],$endif$
		$if(it.HasLight)$
		"light": "$it.LightName$",$endif$
		$if(it.HasCamera)$
		"camera": "$it.CameraName$",$endif$
		$if(it.HasRenderer)$
		"material": "$it.MaterialName$",
		"meshId": "$it.MeshId$",$endif$
		$if(it.HasLightmap)$
		"lightmapIndex": $it.LightmapIndex$,
		"lightmapTileOffset": [ $it.LightmapTileOffset; separator=","$ ],$endif$
	},
}$
]
}




