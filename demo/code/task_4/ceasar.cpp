#include "ceasar.h"


char rotate(char c, int shift) {
    char rotated = c;

    if (islower(c)) {
        rotated = (c - 'a' + shift) % 26 + 'a';
    }

    if (isupper(c)) {
        rotated = (c - 'A' + shift) % 26 + 'A';
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



// 5+5+5+5-1-5
