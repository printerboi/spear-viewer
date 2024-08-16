//
// Created by maximilian on 05.07.24.
//

#include "solver.h"

#include <cstdlib>
#include <iostream>

Matrix *create_matrix(int m, int n) {
	Matrix *mat =  (Matrix *) malloc(sizeof(Matrix));

	mat->rows = m;
	mat->columns = n;

	mat->data = (double *) malloc(m*n*sizeof(double));

	for (int i = 0; i < m*n; i++){
		mat->data[i] = 0.0;
	}

	return mat;
}

int populate(Matrix *mat, double (&values)[3][3]) {
	for(int i = 0; i < mat->rows; i++){
		for(int j = 0; j < mat->columns; j++){
			double val = values[i][j];
			setEntry(mat, i, j, val);
		}
	}

	return 0;
}

int populate(Matrix *mat, double (&values)[3][1]) {
	for(int i = 0; i < mat->rows; i++){
		for(int j = 0; j < mat->columns; j++){
			double val = values[i][j];
			setEntry(mat, i, j, val);
		}
	}

	return 0;
}

void print(Matrix* mat) {
	for(int i = 0; i < mat->rows; i++){
		std::cout << "[";

		for(int j = 0; j < mat->columns; j++){
			std::cout << getEntry(mat, i, j);
			if(j != mat->columns-1){
				std::cout << ", ";
			}
		}

		std::cout << "]" << std::endl;
	}
	std::cout << std::endl;
}


void setEntry(Matrix* mat, int row, int column, double value) {
	mat->data[column * mat->rows + row] = value;
}


double getEntry(Matrix * mat, int row, int column) {
	return mat->data[column * mat->rows + row];
}


int multiply(Matrix *A, Matrix *B, Matrix *C) {
	if (!A || !B || !C){
		return -1;
	}

	if (A->columns != B->rows || A->rows != C->rows || B->columns != C->columns){
		return -2;
	}

	for(int i=0; i < B->columns; i++){
		for(int j=0; j < A->rows; j++){
			double elementVal = 0.0;
			for(int k = 0; k < A->columns; k++){
				elementVal = elementVal + getEntry(A, j, k) * getEntry(B, k, i);;
				setEntry(C, j, i, elementVal);
			}
		}
	}

	return 0;
}

void solve(Matrix *A, Matrix *b, Matrix *C, int convergence) {
	std::cout << "============= GAUS SEIDEL SOLVER =============" << std::endl;
	for(int n=0; n < convergence; n++){
		for (int i=0; i < A->rows; i++){
			double tempval = getEntry(b, i, 0);

			for(int j=0; j < A->rows; j++){
				if(i != j){
					double entrA = getEntry(A, i, j);
					double entrC = getEntry(C, j, 0);
					tempval = tempval -  entrA * entrC ;
				}
			}

			setEntry(C, i, 0, tempval / getEntry(A, i, i));
		}

		print(C);
	}
	std::cout << "============= GAUS SEIDEL SOLVER =============" << std::endl;

}

