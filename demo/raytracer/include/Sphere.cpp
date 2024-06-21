//
// Created by maximilian on 21.06.24.
//

#include "Sphere.h"

Sphere::Sphere(const point3& center, double radius) {
	this->center = center;
	this->radius = fmax(0, radius);
}

bool Sphere::hit(const Ray& ray, Interval ray_t, hit_point& rec) const {
	vec3 oc = center - ray.getOrigin();
	auto a = ray.getDirection().length2();
	auto h = dot(ray.getDirection(), oc);
	auto c = oc.length2() - radius*radius;

	auto discriminant = h*h - a*c;
	if (discriminant < 0)
		return false;

	auto sqrtd = sqrt(discriminant);

	// Find the nearest root that lies in the acceptable range.
	auto root = (h - sqrtd) / a;
	if (!ray_t.surrounds(root)) {
		root = (h + sqrtd) / a;
		if (!ray_t.surrounds(root))
			return false;
	}

	rec.t = root;
	rec.point = ray.at(rec.t);
	vec3 outward_normal = (rec.point - center) / radius;
	rec.set_face_normal(ray, outward_normal);

	return true;
}

