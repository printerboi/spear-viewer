cmake_minimum_required(VERSION 3.25)
project(openssl-handshake)

set(CMAKE_CXX_STANDARD 17)

add_executable(openssl-handshake
    includes/httpsClient.cpp
    includes/httpsClient.h
    includes/util.cpp
    includes/util.h
    main.cpp
)

find_package(OpenSSL REQUIRED)
target_link_libraries(openssl-handshake OpenSSL::SSL)