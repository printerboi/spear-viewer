//
// Created by maximilian on 16.06.24.
//

#include "vec3.h"
#include "util.h"


double vec3::x() const {
	return this->components[0];
}

double vec3::y() const {
	return this->components[1];
}

double vec3::z() const {
	return this->components[2];
}

vec3 vec3::operator-() const {
	return {-this->components[0], -this->components[1], -this->components[2]};
}

double vec3::operator[](int i) const {
	return this->components[i];
}

double& vec3::operator[](int i) {
	return this->components[i];
}

vec3& vec3::operator+=(const vec3& vector) {
	this->components[0] += vector.components[0];
	this->components[1] += vector.components[1];
	this->components[2] += vector.components[2];
	return *this;
}

vec3& vec3::operator*=(double value) {
	this->components[0] *= value;
	this->components[1] *= value;
	this->components[2] *= value;
	return *this;
}

vec3& vec3::operator/=(double value) {
	return *this *= 1/value;
}

double vec3::length() const {
	return sqrt(length2());
}

double vec3::length2() const {
	return this->components[0]*this->components[0] + this->components[1]*this->components[1] + this->components[2]*this->components[2];
}
