//
// Created by maximilian on 05.07.24.
//

#ifndef SOLVER_H
#define SOLVER_H

struct Matrix {
	int rows;
	int columns;
	double *data;
};
typedef struct Matrix Matrix;

double getEntry(Matrix *mat, int row, int column);

void setEntry(Matrix *mat, int row, int column, double value);

void print(Matrix *mat);

Matrix *create_matrix(int m, int n);

int populate(Matrix *mat, double (&values)[3][3]);

int populate(Matrix *mat, double (&values)[3][1]);

int multiply(Matrix *A, Matrix *B, Matrix *C);

void solve(Matrix *A, Matrix *b, Matrix *C, int convergence);


#endif //SOLVER_H
