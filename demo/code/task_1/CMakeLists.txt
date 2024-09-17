cmake_minimum_required(VERSION 3.25)
project(task_1)

set(CMAKE_CXX_STANDARD 20)

add_executable(task_1 main.cpp
        includes/sorter.cpp
        includes/sorter.h)
