#include "ceasar.h"


char rotate(char c, int shift) {
    char rotated = c;

    if (islower(c)) {
        char offset = 'a';
        char base = c - offset;
        char globaloffset = 'a';
        rotated = (base + shift) % 26 + globaloffset;
    }

    if (isupper(c)) {
        char offset = 'A';
        rotated = (c - 'A' + shift) % 26 + offset;
    }

    if (isdigit(c)) {
        rotated = (c - '0' + shift) % 10 + '0';
    }

    return rotated;
}

std::string encrypt(std::string plainText, int shift){
  std::string cipherText;

  for(int i = 0; i < plainText.length(); i++) {
      char c = plainText.at(i);
      char rotated = rotate(c, shift);
      cipherText += rotated;
  }

  return cipherText;
}
