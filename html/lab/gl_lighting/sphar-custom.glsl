// Generated using prefilter  http://cseweb.ucsd.edu/~ravir/papers/envmap/prefilter.c
// from http://cseweb.ucsd.edu/~ravir/papers/envmap/index.html
// 
// based on float texture from http://www.pauldebevec.com/Probes/Float2/

// To make a data set from a custom picture export it from PS as Portable Bitmap with 32 bits per channel

// Kitchen (need to invert z in normal)
// const float MULT = 0.1;
// const vec3 L00  = vec3( 6.407947,  6.751896,  7.296709) * MULT;
// const vec3 L1m1 = vec3(-2.789394, -3.099716, -3.235576) * MULT;
// const vec3 L10  = vec3( 4.226734,  6.026839,  7.784636) * MULT;
// const vec3 L11  = vec3(-0.483446, -0.378620, -0.202811) * MULT;
// const vec3 L2m2 = vec3( 1.003783,  0.775549,  0.512213) * MULT;
// const vec3 L2m1 = vec3(-2.433385, -3.847562, -5.221323) * MULT;
// const vec3 L20  = vec3( 3.860451,  5.498136,  7.241174) * MULT;
// const vec3 L21  = vec3( 0.580907,  0.062693, -0.238086) * MULT;
// const vec3 L22  = vec3(-0.293273, -0.193101, -0.272941) * MULT;

// Narrow path
const float MULT = 0.2;
const vec3 L00  = vec3( 1.093643,  1.015049,  1.448888) * MULT;
const vec3 L1m1 = vec3( 0.396856,  0.566814,  1.353561) * MULT;
const vec3 L10  = vec3( 0.577030,  0.450896,  0.085628) * MULT;
const vec3 L11  = vec3(-0.482008, -0.337463, -0.310445) * MULT;
const vec3 L2m2 = vec3(-0.070031, -0.049113, -0.130779) * MULT;
const vec3 L2m1 = vec3( 0.010474,  0.090886, -0.186190) * MULT;
const vec3 L20  = vec3( 0.157969,  0.180483,  0.056659) * MULT;
const vec3 L21  = vec3(-0.595699, -0.506144, -0.434984) * MULT;
const vec3 L22  = vec3(-0.163577, -0.358538, -1.084744) * MULT;

// Arches
// const float MULT = 1.2;
// const vec3 L00  = vec3( 0.728397,  0.637505,  0.973854) * MULT;
// const vec3 L1m1 = vec3(-0.146787,  0.230406,  0.771574) * MULT;
// const vec3 L10  = vec3(-0.333028, -0.294193, -0.609734) * MULT;
// const vec3 L11  = vec3(-0.040311,  0.005672, -0.028863) * MULT;
// const vec3 L2m2 = vec3( 0.012326, -0.087454, -0.141814) * MULT;
// const vec3 L2m1 = vec3( 0.325576, -0.057172, -0.433798) * MULT;
// const vec3 L20  = vec3( 0.151050, -0.002510, -0.011993) * MULT;
// const vec3 L21  = vec3( 0.043405, -0.081459, -0.106410) * MULT;
// const vec3 L22  = vec3(-0.049250,  0.039936, -0.110091) * MULT;





