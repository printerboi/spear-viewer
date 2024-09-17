cmake_minimum_required(VERSION 3.25)
project(task_6)

set(CMAKE_CXX_STANDARD 17)

add_executable(task_6 main.cpp
        include/vec3.cpp
        include/vec3.h
        include/color.h
        include/Ray.cpp
        include/Ray.h
        include/Camera.cpp
        include/Camera.h
        include/color.cpp
        include/hitable.h
        include/Sphere.cpp
        include/Sphere.h
        include/hitable_list.cpp
        include/hitable_list.h
        include/util.h
        include/interval.h
        include/interval.cpp)
