#include <iostream>
#include "includes/converter.h"

int main() {
    std::cout << "====== Temperature calculator ======" << std::endl;
    std::cout << "Select mode:" << std::endl;
    std::cout << "\t 0) Celsius to Fahrenheit" << std::endl;
    std::cout << "\t 1) Fahrenheit to Celsius" << std::endl;
    std::cout << "\t 2) Celsius to Kelvin" << std::endl;
    std::cout << "\t 3) Fahrenheit to Celsius" << std::endl;
    int mode = 0;
    double value = 255;

    std::cout << "Insert Value: ";

    handler(mode, value);

    return 0;
}
