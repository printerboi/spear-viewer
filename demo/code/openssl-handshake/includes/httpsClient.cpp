#include "httpsClient.h"

/**
 * Implementation of a simple https connect for demo purposes
 * Based on: https://opensource.com/article/19/6/cryptography-basics-openssl-part-1
 */



void init(){
  SSL_library_init();
  SSL_load_error_strings();
  OpenSSL_add_all_algorithms();
}

void abortConnection(std::string reason){
    std::clog << "Connection failed! Reason: " << reason << std::endl;
    exit(-1);
}

SSL_CTX* initContext() {
    SSL_CTX* context;

    context = SSL_CTX_new(TLS_client_method());
    if(context == nullptr){
        abortConnection("Context could not be established!");
    }

    return context;
}

BIO* initBIO(SSL_CTX* context) {
    BIO* bio;

    bio = BIO_new_ssl_connect(context);
    if(bio == nullptr){
        abortConnection("Input/Ouput object could not be created!");
    }

    return bio;
}

void establishConnection(std::string url){
    // Create init objects used to define ssl parameters


    // Call openssl functions to establish the parameters
    SSL_CTX* context = initContext();
    BIO* bio = initBIO(context);

    std::cout << "\tInitialized SSL parameters" << std::endl;

    // Parse the given url to seperate the hostname from the protocol
    std::ostringstream namestream;
    namestream << url << ":" << "https";
    std::string name = namestream.str();

    // Prepare connection
    BIO_set_conn_hostname(bio, name.c_str());

    SSL *ssl;
    BIO_get_ssl(bio, &ssl);
    if (ssl == NULL) {
        abortConnection("Session could not be created");
    }
    SSL_set_mode(ssl, SSL_MODE_AUTO_RETRY);

    std::cout << "\tLinked session" << std::endl;


    connect(context, bio);
    std::cout << "\tConnected!" << std::endl;

    // Do ssl handshake
    if (BIO_do_handshake(bio) <= 0){
        abortConnection("Certs could not be verified!");
    }

    std::cout << "\tStarting data fetching..." << std::endl;

    fetchData(bio, url);
    cleanUpSSLArtifacts(context, bio);
    std::cout << "\tCleanup finished!" << std::endl;

}

void connect(SSL_CTX* ctx, BIO* bio){
    int attemptedConnect = BIO_do_connect(bio);
    if(attemptedConnect <= 0){
        cleanUpSSLArtifacts(ctx, bio);
        abortConnection("Connection failed!");
    }


}

void fetchData(BIO* bio, std::string url){
    std::ostringstream requestStream;
    requestStream << "GET / HTTP/1.1\r\nHost: " << url << "\r\nConnection: close\r\n\r\n";
    std::string requestString = requestStream.str();
    const char *request = requestString.c_str();
    if (BIO_write(bio, request, strlen(request)) <= 0){
        if (!BIO_should_retry(bio)){
            abortConnection("Fetching failed");
        }
    }

    char buffer[4096];
    int bytesRead;

    while ((bytesRead = BIO_read(bio, buffer, sizeof(buffer) - 1)) > 0) {
        buffer[bytesRead] = '\0';  // Null-terminieren der empfangenen Daten
        printf("%s", buffer);
    }

    if (bytesRead < 0) {
        if (!BIO_should_retry(bio)) {
            ERR_print_errors_fp(stderr);
        }
    }
}