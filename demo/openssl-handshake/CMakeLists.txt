cmake_minimum_required(VERSION 3.25)
project(openssl-example)

set(CMAKE_CXX_STANDARD 17)

add_executable(openssl-example 
    includes/httpsClient.cpp
    includes/httpsClient.h
    includes/util.cpp
    includes/util.h
    main.cpp
)

find_package(OpenSSL REQUIRED)
target_link_libraries(openssl-example OpenSSL::SSL)