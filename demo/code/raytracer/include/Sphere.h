//
// Created by maximilian on 21.06.24.
//

#ifndef SPHERE_H
#define SPHERE_H

#include "hitable.h"
#include "util.h"


class Sphere : public hitable {
public:
	Sphere(const point3& center, double radius);

	bool hit(const Ray& r, Interval ray_t, hit_point& rec) const override;

private:
	point3 center;
	double radius;
};

#endif //SPHERE_H
