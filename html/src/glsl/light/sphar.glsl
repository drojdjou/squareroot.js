const float C1 = 0.429043;
const float C2 = 0.511664;
const float C3 = 0.743125;
const float C4 = 0.886227;
const float C5 = 0.247708;

vec3 sphericalHarmonics(vec3 n) {
    
    vec3 c =  C1 * L22 * (n.x * n.x - n.y * n.y) +
                    C3 * L20 * n.z * n.z +
                    C4 * L00 -
                    C5 * L20 +
                    2.0 * C1 * L2m2 * n.x * n.y +
                    2.0 * C1 * L21  * n.x * n.z +
                    2.0 * C1 * L2m1 * n.y * n.z +
                    2.0 * C2 * L11  * n.x +
                    2.0 * C2 * L1m1 * n.y +   
                    2.0 * C2 * L10  * n.z;
    
    return c;
}