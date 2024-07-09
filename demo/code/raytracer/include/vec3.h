//
// Created by maximilian on 16.06.24.
//

#ifndef VEC3_H
#define VEC3_H
#include <ostream>


class vec3 {
public:
    double components[3];

    vec3() : components{0,0,0} {}

    vec3(double component0, double component1, double component2) : components{component0, component1, component2} {}

    /**
     * Get x component of vector
     * @return x-value
     */
    double x() const;

    /**
     * Get y component of vector
     * @return y-value
     */
    double y() const;

    /**
     * Get z component of vector
     * @return z-value
     */
    double z() const;

    /**
     * Negates the single components of the vector
     * @return negated vector
     */
    vec3 operator-() const;

    /**
     * Will use array notation to access components of vector
     * @param i Index of the component (x -> 0; y -> 1; z -> 2)
     * @return Requested dimension component
     */
    double operator[](int i) const;

    /**
     * Will use array notation to access components of vector
     * @param i Index of the component (x -> 0; y -> 1; z -> 2)
     * @return Requested dimension component
     */
    double& operator[](int i);

    /**
     * Adds a given vector to the this vector
     * @param vector Vector to be added
     * @return Reference to this vector
     */
    vec3& operator+=(const vec3& vector);

    /**
     * Multiplies this vector with a given vector
     * @param vector Vector to multiply the vector with
     * @return Reference to this vector
     */
    vec3& operator*=(double value);


    /**
     * Divides the components of the vector by the given factor
     * @param value Value to divide the components by
     * @return Reference to this vector
     */
    vec3& operator/=(double value);

    /**
     * Calculates the length of the vector
     * @return Length of the vector
     */
    double length() const;

    /**
     * Calculates the squared length of the vector
     * @return Squared length
     */
    double length2() const;
};

inline std::ostream& operator<<(std::ostream& out, const vec3& v) {
 return out << v.components[0] << ' ' << v.components[1] << ' ' << v.components[2];
}

using point3 = vec3;


inline vec3 operator+(const vec3& u, const vec3& v) {
 return vec3(u.components[0] + v.components[0], u.components[1] + v.components[1], u.components[2] + v.components[2]);
}

inline vec3 operator-(const vec3& u, const vec3& v) {
 return vec3(u.components[0] - v.components[0], u.components[1] - v.components[1], u.components[2] - v.components[2]);
}

inline vec3 operator*(const vec3& u, const vec3& v) {
 return vec3(u.components[0] * v.components[0], u.components[1] * v.components[1], u.components[2] * v.components[2]);
}

inline vec3 operator*(double t, const vec3& v) {
 return vec3(t*v.components[0], t*v.components[1], t*v.components[2]);
}

inline vec3 operator*(const vec3& v, double t) {
 return t * v;
}

inline vec3 operator/(const vec3& v, double t) {
 return (1/t) * v;
}

inline double dot(const vec3& u, const vec3& v) {
 return u.components[0] * v.components[0]
      + u.components[1] * v.components[1]
      + u.components[2] * v.components[2];
}

inline vec3 cross(const vec3& u, const vec3& v) {
 return vec3(u.components[1] * v.components[2] - u.components[2] * v.components[1],
             u.components[2] * v.components[0] - u.components[0] * v.components[2],
             u.components[0] * v.components[1] - u.components[1] * v.components[0]);
}

inline vec3 unit_vector(const vec3& v) {
 return v / v.length();
}


#endif //VEC3_H
