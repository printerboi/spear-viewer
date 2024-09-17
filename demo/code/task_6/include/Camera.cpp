//
// Created by maximilian on 21.06.24.
//

#include "Camera.h"


Camera::Camera(int width, double ratio, point3& camera_center, double focal_length, double viewport_height){
	this->width = width;
	this->aspect_ratio = ratio;

	this->height = int(this->width / this->aspect_ratio);
	if(this->height  < 1){
		this->height  = 1;
	}


	this->focal_lengh = focal_length;
	this->viewport_height = viewport_height;
	this->viewport_width = this->viewport_height * ( static_cast<double>(this->width) / height );
	this->camera_center = camera_center;

	this->viewport_u = vec3(this->viewport_width, 0, 0);
	this->viewport_v = vec3(0, -this->viewport_height, 0);

	this->pixel_delta_v = viewport_u / this->width;
	this->pixel_delta_u = viewport_v / this->height;
}

vec3 Camera::get_upper_left_pixel() {
	vec3 viewport_upper_left = this->camera_center - vec3(0, 0, this->focal_lengh) - viewport_u/2 - viewport_v/2;

	return viewport_upper_left + 0.5 * (pixel_delta_u + pixel_delta_v);
}

int Camera::get_width() {
	return this->width;
}

int Camera::get_height() {
	return this->height;
}

Ray Camera::construct_ray_for_pixel(int y, int x) {
	vec3 upper_left_pixel = this->get_upper_left_pixel();
	vec3 pixel_center = upper_left_pixel + ( y * this->pixel_delta_u ) + ( x * this->pixel_delta_v);

	vec3 ray_direction = pixel_center - this->camera_center;

	return Ray(this->camera_center, ray_direction);
}
