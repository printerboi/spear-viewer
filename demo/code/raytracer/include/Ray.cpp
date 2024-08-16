//
// Created by maximilian on 21.06.24.
//

#include "Ray.h"

#include <limits>
#include <cmath>

#include "hitable.h"

const vec3& Ray::getDirection() const {
	return this->dirrection;
}

const point3& Ray::getOrigin() const {
	return this->origin;
}

point3 Ray::at(double t) const {
	return this->origin + t * this->dirrection;
}

color Ray::getColor(hitable& world) {
	hit_point rec;
	if (world.hit(*this, Interval(0, infinity), rec)) {
		return 0.5 * (rec.normal + color(1,1,1));
	}

	vec3 unit_direction = unit_vector(this->dirrection);
	auto scann = 0.5*(unit_direction.y() + 1.0);
	return (1.0-scann)*color(1.0, 1.0, 1.0) + scann*color(0.5, 0.7, 1.0);
}


double Ray::hit_sphere(const point3& center, double radius) {
	vec3 oc = center - this->origin;
	auto a = dot(this->dirrection, this->dirrection);
	auto b = -2.0 * dot(this->dirrection, oc);
	auto c = dot(oc, oc) - radius*radius;
	auto discriminant = b*b - 4*a*c;
	if (discriminant < 0) {
		return -1.0;
	}

	return (-b - std::sqrt(discriminant) ) / (2.0*a);
}
