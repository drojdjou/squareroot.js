/**
 *  CSS + CSS3D animation
 *
 *  1/ element
 *  2/ time
 *  3/ delay
 *  4/ easing http://matthewlein.com/ceaser/
 *  5/ properties
 *      - positionX,Y,Z,
 *      - rotationX,Y,Z
 *      - scaleX,Y,Z
 *  6/ flags
 *      - useTransition
 *  7/ callback
 */
SQR.Animation = function(obj) {

    if (!obj.element) throw "Obligatory parameter 'element' is missing";

    obj.time = obj.time || 1;
    obj.delay = obj.delay || 0;
    obj.easing = obj.easing || 'ease'
}

SQR.Animation.getEaseFunction = function(a, b, c, d) {
    return 'cubic-bezier(' + a + ',' + b + ',' + c + ',' + d + ')';
}