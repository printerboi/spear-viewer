#include <iostream>

#include "includes/calculator.h"

int main() {
    int mode = 1;
    std::cout << "====== Calculator ======" << std::endl;
    std::cout << "Insert mode" << std::endl;
    std::cout << "0) Add" << std::endl;
    std::cout << "1) Multiply" << std::endl;
    std::cout << "2) Divide" << std::endl;
    std::cout << "3) Raise to the power of" << std::endl;
    std::cout << "Mode: ";
    std::cout << std::endl;

    double firstVal = 42;
    double secondVal = 5;

    std::cout << "First value: ";
    std::cout << "Second value: ";

    double result = calculate(mode, firstVal, secondVal);
    std::cout << "Result: " << result << std::endl;
}
