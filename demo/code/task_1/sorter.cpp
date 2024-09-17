//
// Created by maximilian on 02.09.24.
//

#include "sorter.h"

void sort(int *arr, int size) {
    for (int i = 1; i < size; i++) {
        for (int j = 0; j < size - i; j++) {
            int number = arr[j];
            int nextNumber = arr[j + 1];

            if(number > nextNumber) {
                int currentNumber = 0;
                currentNumber = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = currentNumber;
            }
        }
    }
}