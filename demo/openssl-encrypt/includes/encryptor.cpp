#include "encryptor.h"

#include <openssl/pem.h>


void encrypt(std::string plaintext) {
    std::string outputString;

    std::cout << "Reading public key file..." << std::endl;
    FILE *fp = fopen("pubkey.pem", "r");
    EVP_PKEY *pubkey = PEM_read_PUBKEY(fp, nullptr, nullptr, nullptr);
    fclose(fp);

    EVP_PKEY_CTX* ctx = nullptr;
    ctx = EVP_PKEY_CTX_new(pubkey, nullptr);
    EVP_PKEY_encrypt_init(ctx);

    size_t ciphertextLen;
    EVP_PKEY_encrypt(ctx, nullptr, &ciphertextLen, (const unsigned char*) plaintext.c_str(), plaintext.size());
    unsigned char* ciphertext = (unsigned char*) OPENSSL_malloc(ciphertextLen);

    EVP_PKEY_encrypt(ctx, ciphertext, &ciphertextLen, (const unsigned char*) plaintext.c_str(), plaintext.size());
    outputString.assign((char*)ciphertext, ciphertextLen);

    // Release memory
    EVP_PKEY_free(pubkey);
    EVP_PKEY_CTX_free(ctx);
    OPENSSL_free(ciphertext);

    writeOuput(outputString);
}

void writeOuput(std::string output) {
    std::ofstream outputFile ("encrypted.bin");
    if(outputFile.is_open()){
        outputFile << output;
        outputFile.close();
    }
}