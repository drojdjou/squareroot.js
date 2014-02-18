// Based on http://natureofcode.com/book/chapter-2-forces/
SQR.Particle = function(p) {

    p = p || new SQR.V2();

    this.position = p;
    this.velocity = p.clone().set();
    this.acceleration = p.clone().set();

    this.angularVelocity = 0;
    this.angularAcceleration = 0;

    this.mass = 1;
    this.friction = 2;
    this.bounciness = 1;

    // Used to calculate the 'force/mass'
    var force = p.clone().set();
    var frictionVec = p.clone().set();

    this.addForce = function(f) {
        force.copyFrom(f);
        force.mul(1 / this.mass);
        this.acceleration.appendVec(force);
    }

    this.update = function(delta) {
        frictionVec.copyFrom(this.velocity);
        frictionVec.norm();
        frictionVec.mul(-this.friction);
        this.addForce(frictionVec);

        delta = delta || 1;
        this.acceleration.mul(delta);
        this.velocity.appendVec(this.acceleration);

        this.position.appendVec(this.velocity);
        this.acceleration.set();
    }

    // Implement a function to draw
    // the particle on canvas or attach a div to it,
    // or a transform or whatever
    // (as a prototype preferably)
}