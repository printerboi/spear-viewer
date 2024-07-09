#include <iostream>
#include <string>

#include "includes/solver.h"

int main(){
    Matrix *A;
    Matrix *B;

    A = create_matrix(3, 3);
    B = create_matrix(3, 3);

    double valuesA[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };

    double valuesB[3][3] = {
        {7, 8, 9},
        {4, 5, 6},
        {1, 2, 3}
    };


    populate(A, valuesA);
    populate(B, valuesB);

    print(A);
    print(B);

    Matrix *C;
    C = create_matrix(3, 3);
    multiply(A, B, C);

    print(C);

    Matrix *coefficients;
    coefficients = create_matrix(3, 3);
    double coefficientValues[3][3] = {
        {4, 1, 2},
        {3, 5, 1},
        {1, 1, 3}
    };

    populate(coefficients, coefficientValues);

    Matrix *bound;
    bound = create_matrix(3, 1);
    double boundValues[3][1] = {
        {4},
        {7},
        {3}
    };
    populate(bound, boundValues);

    Matrix *result;
    result = create_matrix(3, 1);
    solve(coefficients, bound, result, 8);

    return 0;
}
