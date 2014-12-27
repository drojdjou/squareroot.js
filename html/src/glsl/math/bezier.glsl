float bezierPosition(float t, float p0, float c0, float c1, float p1) {
    return p0 * (1.0 - t) * (1.0 - t) * (1.0 - t) + c0 * 3.0 * t * (1.0 - t) * (1.0 - t) + c1 * 3.0 * t * t * (1.0 - t) + p1 * t * t * t;
}

float bezierVelocity(float t, float p0, float c0, float c1, float p1) {
    return (3.0 * c0 - 3.0 * p0) + 2.0 * (3.0 * p0 - 6.0 * c0 + 3.0 * c1) * t + 3.0 * (-p0 + 3.0 * c0 - 3.0 * c1 + p1) * t * t;
}

vec3 bezierPosition3d(float t, vec3 p0, vec3 c0, vec3 c1, vec3 p1) {
    return p0 * (1.0 - t) * (1.0 - t) * (1.0 - t) + c0 * 3.0 * t * (1.0 - t) * (1.0 - t) + c1 * 3.0 * t * t * (1.0 - t) + p1 * t * t * t;
}