#include <iostream>
#include <string>
#include "ceasar.h"

int main() {
    std::string input = "I am a secret message!";
    int shift = 10;

    std::string result = encrypt(input, shift);

    std::cout << result << std::endl;

    return 0;
}
