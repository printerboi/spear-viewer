cmake_minimum_required(VERSION 3.25)
project(openssl-encrypt)

set(CMAKE_CXX_STANDARD 17)

add_executable(openssl-encrypt
    includes/keygenerator.cpp
    includes/keygenerator.h
    includes/encryptor.cpp
    includes/encryptor.h
    main.cpp
)

find_package(OpenSSL REQUIRED)
target_link_libraries(openssl-encrypt OpenSSL::SSL)