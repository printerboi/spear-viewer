cmake_minimum_required(VERSION 3.25)
project(task_2)

set(CMAKE_CXX_STANDARD 20)

add_executable(task_2 main.cpp
        includes/converter.cpp
        includes/converter.h)
