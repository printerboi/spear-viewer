#include <string>
#include <openssl/types.h>
#include <openssl/bn.h>
#include <openssl/rsa.h>
#include <openssl/pem.h>

void init(EVP_PKEY_CTX *context);

void generateKeyPair(EVP_PKEY *keypair);

void writeKeyPair(EVP_PKEY *keypair);

void cleanup(EVP_PKEY_CTX *context);