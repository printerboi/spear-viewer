//
// Created by maximilian on 21.06.24.
//

#ifndef CAMERA_H
#define CAMERA_H
#include "util.h"


class Camera {
	int width;
	int height;
	double aspect_ratio;

	double focal_lengh;
	double viewport_height;
	double viewport_width;
	point3 camera_center;

	vec3 viewport_u;
	vec3 viewport_v;
	vec3 pixel_delta_v;
	vec3 pixel_delta_u;

	vec3 get_upper_left_pixel();



public:
	Camera(int width, double ratio, point3& camera_center, double focal_length = 1.0, double viewport_height = 2.0);

	int get_width();

	int get_height();

	Ray construct_ray_for_pixel(int x, int y);
};



#endif //CAMERA_H
