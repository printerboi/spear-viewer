#ifndef CEASAR_H
#define CEASAR_H

#include <string>

std::string encrypt(std::string input, int shift);

char rotate(char c, int shift);

#endif //CEASAR_H
