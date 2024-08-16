#include <iostream>
#include "includes/httpsClient.h"


int main(){
    init();
    std::string url;
    std::cout << "Enter a hostname: ";

    std::cin >> url;
    std::cout << "\tStarting..." << std::endl;
    std::cout << "\tAttempting to connect to " << url << std::endl;

    establishConnection(url);

    return 0;
}