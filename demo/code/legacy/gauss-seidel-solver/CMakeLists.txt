cmake_minimum_required(VERSION 3.25)
project(gauss-seidel-solver)

set(CMAKE_CXX_STANDARD 17)

add_executable(gauss-seidel-solver
        main.cpp
        includes/solver.cpp
        includes/solver.h
)

find_package(OpenSSL REQUIRED)
target_link_libraries(gauss-seidel-solver OpenSSL::SSL)