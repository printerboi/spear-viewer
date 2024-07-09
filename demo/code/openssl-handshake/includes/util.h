#include <openssl/err.h>
#include <openssl/ssl.h>


void cleanUpSSLArtifacts(SSL_CTX* ctx, BIO* bio);