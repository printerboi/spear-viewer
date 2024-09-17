//
// Created by maximilian on 02.09.24.
//

#include "calculator.h"

#include <complex>
#include <cmath>


double calculate(int mode, double a, double b) {
    double result = 0.0;

    switch (mode) {
        case 0:
            result = add(a, b);
        break;
        case 1:
            result = mult(a, b);
        break;
        case 2:
            result = divide(a, b);
        break;
        case 3:
            result = pow(a, b);
        break;
        default:
            result = 0.0;
    }

    return result;
}


double add(double a, double b) {
    double c;
    c = a + b;
    return c;
}

double mult(double a, double b) {
    return a * b;
}

double divide(double a, double b) {
    return a / b;
}

double pow(double a, double b) {
    double result = a;
    for(int i = 0; i < b-1; i++) {
        result = result * a;
    }

    return result;
}