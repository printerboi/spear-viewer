#include <iostream>
#include "includes/httpsClient.h"


int main(){
    init();
    std::cout << "Starting..." << std::endl;

    const std::string url = "www.wikipedia.org";
    std::cout << "\tAttempting to connect to " << url << std::endl;

    establishConnection(url);

    return 0;
}