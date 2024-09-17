#ifndef HITTABLE_LIST_H
#define HITTABLE_LIST_H

#include "hitable.h"
#include <vector>
#include "util.h"

class hittable_list : public hitable {
public:
	std::vector<shared_ptr<hitable>> objects;

	hittable_list();
	explicit hittable_list(shared_ptr<hitable> object);

	void clear();

	void add(shared_ptr<hitable> object);

	bool hit(const Ray& r, Interval ray_t, hit_point& rec) const override;
};

#endif