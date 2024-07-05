#include <string>
#include <openssl/crypto.h>
#include <openssl/bn.h>
#include <iostream>
#include <fstream>
#include <sstream>


std::pair<std::string, std::string> readInKeyPair();

void encrypt(std::string plaintext);

std::string decrypt(unsigned char * ciphertext);
