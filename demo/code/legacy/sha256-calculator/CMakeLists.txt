cmake_minimum_required(VERSION 3.25)
project(sha256-calculator)

set(CMAKE_CXX_STANDARD 17)

add_executable(sha256-calculator
        main.cpp
        includes/sha256.cpp
        includes/sha256.h
        includes/fileReader.cpp
        includes/fileReader.h
)

find_package(OpenSSL REQUIRED)
target_link_libraries(sha256-calculator OpenSSL::SSL)