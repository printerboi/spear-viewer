#include <string>
#include <openssl/ssl.h>
#include <iostream>
#include <sstream>
#include "util.h"

void init();

void abortConnection(std::string reason);

SSL_CTX* initContext();

BIO* initBIO(SSL_CTX* context);

void establishConnection(std::string url);

void connect(SSL_CTX* ctx, BIO* bio);

void fetchData(BIO* bio);