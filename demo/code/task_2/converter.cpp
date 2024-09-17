//
// Created by maximilian on 02.09.24.
//

#include "converter.h"

#include <iostream>
#include <ostream>
#include <string>


void handler(int mode, double value) {
    double temp = value;
    std::string symbol;

    if(mode == 0) {
        temp = celsiusToFahrenheit(temp);
    }else if(mode == 1) {
        temp = fahrenheitToCelsius(temp);
    }else if(mode == 2) {
        temp = celsiusToKelvin(temp);
    }else if(mode == 3) {
        temp = fahrenheitToKelvin(temp);
    }

    if(mode == 0) {
        symbol = "°F";
    }else if(mode == 1) {
        symbol = "°C";
    }else if(mode == 2) {
        symbol = "K";
    }else if(mode == 3) {
        symbol = "K";
    }

    std::cout << temp << " " << symbol << std::endl;
}

double celsiusToFahrenheit(double value) {
    double fahrenheitValue = (value * 9/5) + 32;
    return fahrenheitValue;
}

double fahrenheitToCelsius(double value) {
    return (value - 32) * 5/9;
}

double celsiusToKelvin(double value) {
    return value + 273.15;
}

double fahrenheitToKelvin(double fahrenheit) {
    double celsiusVal = (fahrenheit - 32.0) * 5/9;
    double kelvinVal = celsiusVal + 273.15;
    return kelvinVal;
}

