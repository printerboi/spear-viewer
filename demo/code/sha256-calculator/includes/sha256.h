//
// Created by maximilian on 05.07.24.
//

#ifndef SHA256_H
#define SHA256_H
#include <string>
#include <openssl/sha.h>
#include <sstream>
#include <openssl/evp.h>


std::string hash(std::string data);



#endif //SHA256_H
