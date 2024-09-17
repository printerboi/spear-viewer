//
// Created by maximilian on 21.06.24.
//

#include "hitable_list.h"

hittable_list::hittable_list() {}

hittable_list::hittable_list(shared_ptr<hitable> object) {
	add(object);
}

void hittable_list::clear() {
	objects.clear();
}

void hittable_list::add(shared_ptr<hitable> object) {
	objects.push_back(object);
}

bool hittable_list::hit(const Ray& r, Interval ray_t, hit_point& rec) const {
	hit_point temp_rec;
	bool hit_anything = false;
	auto closest_so_far = ray_t.max;

	for (const auto& object : objects) {
		if (object->hit(r, Interval(ray_t.min, closest_so_far), temp_rec)) {
			hit_anything = true;
			closest_so_far = temp_rec.t;
			rec = temp_rec;
		}
	}

	return hit_anything;
}