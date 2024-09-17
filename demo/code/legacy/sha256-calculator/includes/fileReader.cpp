//
// Created by maximilian on 05.07.24.
//

#include "fileReader.h"

#include <fstream>
#include <openssl/sha.h>


void readFileToBuffer(char* buffer, std::string filename, SHA256_CTX context) {
	std::ifstream fileToRead(filename, std::ifstream::binary);

	while (fileToRead.good()){
		fileToRead.read(buffer, sizeof(buffer));

		if(!SHA256_Update(&context, buffer, 1024 * 16)){
			return;
		}
	}
}
