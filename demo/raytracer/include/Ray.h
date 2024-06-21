//
// Created by maximilian on 21.06.24.
//

#ifndef RAY_H
#define RAY_H
#include "color.h"
#include "vec3.h"

class hitable;

class Ray {
public:
	Ray() {}

	Ray(const point3& orig, const vec3& dir) : origin(orig), dirrection(dir) {}

	const point3& getOrigin() const;

	const vec3& getDirection() const;

	point3 at(double t) const;

	color getColor(hitable& world);

	double hit_sphere(const point3& center, double radius);

private:
	point3 origin;
	vec3 dirrection;
};





#endif //RAY_H
