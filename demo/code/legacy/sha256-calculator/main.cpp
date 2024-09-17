#include <iostream>
#include <string>

#include "includes/sha256.h"

int main(){

    std::string hash = ::hash("samplefile.txt");
    std::cout << hash << std::endl;

    std::string hashtwo = ::hash("samplefile.txt");
    std::cout << hash << std::endl;

    return 0;
}
