//
// Created by maximilian on 05.07.24.
//

#include "sha256.h"

#include <iomanip>

#include "fileReader.h"

std::string hash(std::string filename) {
	SHA256_CTX context;

	if(!SHA256_Init(&context)){
		return "";
	}

	char fileBuffer[1024 * 16];
	readFileToBuffer(fileBuffer, filename, context);

	unsigned char result[SHA256_DIGEST_LENGTH];
	if(!SHA256_Final(result, &context)){
		return "";
	}

	std::stringstream shastr;
	shastr << std::hex << std::setfill('0');
	for (const auto &byte: result)
	{
		shastr << std::setw(2) << (int)byte;
	}
	return shastr.str();

}
