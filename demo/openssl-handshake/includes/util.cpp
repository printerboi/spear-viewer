#include "util.h"

void cleanUpSSLArtifacts(SSL_CTX* ctx, BIO* bio){
    SSL_CTX_free(ctx);
    BIO_free_all(bio);
    EVP_cleanup();
    ERR_free_strings();
}
