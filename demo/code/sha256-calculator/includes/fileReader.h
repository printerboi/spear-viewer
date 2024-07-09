//
// Created by maximilian on 05.07.24.
//

#ifndef FILEREADER_H
#define FILEREADER_H
#include <string>
#include <openssl/sha.h>


void readFileToBuffer(char *buffer, std::string filename, SHA256_CTX context);





#endif //FILEREADER_H
