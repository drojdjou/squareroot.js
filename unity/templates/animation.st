{
$animations:{
 "$it.UID$": {
  "root": "$it.Name$",
  "length": $it.Length$,
  "framerate": $it.FrameRate$,
  "quaternions":$if(quaternions)$ true$else$ false$endif$,
  "curves": {$it.Transforms:{
   "$it.Name$": {$it.Properties:{$if(it.HasChangeInValue)$
     "$it.Property$": {
      "post": "$it.PostWrapMode$",
      "pre": "$it.PreWrapMode$",
      "keys": [$it.Keys:{
         $it.time$, $it.value$, $it.inTangent$, $it.outTangent$,}$
       ],
      },$endif$
    }$
   },}$
  }
 },
}$
}