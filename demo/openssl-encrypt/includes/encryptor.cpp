#include "encryptor.h"


std::pair<std::string, std::string> readInKeyPair() {
    std::ifstream privKeyFile ("privkey.pem");
    std::stringstream privateKey;

    if(privKeyFile.is_open()) {
        char currentChar;
        while ( privKeyFile ) {
            currentChar = privKeyFile.get();
            privateKey << currentChar;
        }
    }

    std::ifstream pubKeyFile ("pubkey.pem");
    std::stringstream publicKey;

    if(pubKeyFile.is_open()) {
        char currentChar;
        while ( pubKeyFile ) {
            currentChar = pubKeyFile.get();
            publicKey << currentChar;
        }
    }

    privKeyFile.close();
    pubKeyFile.close();

    return { privateKey.str(), publicKey.str() };
}

void encrypt(std::string plaintext) {
    std::pair<std::string, std::string> keypair = readInKeyPair();

    std::cout << keypair.first << std::endl;
    std::cout << keypair.second << std::endl;
}

std::string decrypt(unsigned char * ciphertext) {
    return "";
}

