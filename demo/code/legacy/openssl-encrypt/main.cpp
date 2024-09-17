#include <iostream>
#include <string>

#include "includes/encryptor.h"
#include "includes/keygenerator.h"

int main(){
    EVP_PKEY *keypair = nullptr;

    generateKeyPair(keypair);
    encrypt("Lorem Ipsum");

    return 0;
}