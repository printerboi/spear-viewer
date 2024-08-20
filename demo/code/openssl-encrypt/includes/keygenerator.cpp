#include "keygenerator.h"

#include <openssl/evp.h>

void init(EVP_PKEY_CTX *context) {
    EVP_PKEY_keygen_init( context );
}


void generateKeyPair(EVP_PKEY *keypair) {
    EVP_PKEY_CTX *context = EVP_PKEY_CTX_new_id( EVP_PKEY_RSA, nullptr );

    init(context);

    EVP_PKEY_keygen( context, &keypair );
    writeKeyPair(keypair);

    cleanup(context);
}

void writeKeyPair(EVP_PKEY *keypair) {
    FILE* privKeyFile = nullptr;
    const EVP_CIPHER* cipher = EVP_aes_256_cbc();
    const char* keyFilePassword = "";

    privKeyFile = fopen("privkey.pem","wt");

    if(privKeyFile && cipher) {
        int writePrivKey = PEM_write_PrivateKey(privKeyFile, keypair, cipher, (unsigned char*) keyFilePassword, (int) strlen(keyFilePassword), nullptr,
                             nullptr);

        fclose(privKeyFile);
        FILE* publicKeyFile = nullptr;
        publicKeyFile = fopen("pubkey.pem","wt");
        int writePublicKey = PEM_write_PUBKEY(privKeyFile, keypair);

        fclose(publicKeyFile);

    }
}


void cleanup(EVP_PKEY_CTX *context) {
    EVP_PKEY_CTX_free( context );
}
