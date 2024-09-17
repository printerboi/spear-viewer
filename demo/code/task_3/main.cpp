#include <iostream>

#include "calculator.h"

int main() {
    int mode;
    std::cout << "====== Calculator ======" << std::endl;
    std::cout << "Insert mode" << std::endl;
    std::cout << "0) Add" << std::endl;
    std::cout << "1) Multiply" << std::endl;
    std::cout << "2) Divide" << std::endl;
    std::cout << "3) Raise to the power of" << std::endl;
    std::cout << "Mode: ";
    std::cin >> mode;
    std::cout << std::endl;

    double firstVal;
    double secondVal;

    std::cout << "First value: ";
    std::cin >> firstVal;
    std::cout << "Second value: ";
    std::cin >> secondVal;

    double result = calculate(mode, firstVal, secondVal);
    std::cout << "Result: " << result << std::endl;
}
