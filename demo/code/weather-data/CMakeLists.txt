cmake_minimum_required(VERSION 3.25)
project(weather-data)

set(CMAKE_CXX_STANDARD 17)

add_executable(weather-data
        main.cpp
        includes/sensorInterface.cpp
        includes/sensorInterface.h
        includes/csv_reader.cpp
        includes/csv_reader.h
)

find_package(OpenSSL REQUIRED)
target_link_libraries(weather-data OpenSSL::SSL)