//
// Created by maximilian on 21.06.24.
//

#ifndef HITABLE_H
#define HITABLE_H
#include "interval.h"
#include "vec3.h"
#include "Ray.h"

class hit_point {
public:
	point3 point;
	vec3 normal;
	double t;

	bool front_face;

	void set_face_normal(const Ray& r, const vec3& outward_normal) {
		front_face = dot(r.getDirection(), outward_normal) < 0;
		normal = front_face ? outward_normal : -outward_normal;
	}
};

class hitable {
public:
	virtual ~hitable() = default;

    virtual bool hit(const Ray& r, Interval ray_t, hit_point& rec) const = 0;};



#endif //HITABLE_H
