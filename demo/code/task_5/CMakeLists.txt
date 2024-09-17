cmake_minimum_required(VERSION 3.25)
project(task_5)

set(CMAKE_CXX_STANDARD 17)

add_executable(task_5
        main.cpp
        includes/sensorInterface.cpp
        includes/sensorInterface.h
        includes/csv_reader.cpp
        includes/csv_reader.h
)