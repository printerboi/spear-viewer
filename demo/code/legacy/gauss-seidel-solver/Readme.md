# Gauss Seidel Solver

This example program implements a gauss seidel solver which multiplies two matricies. After the multiplication
the program solves a system of linear equations.

The code makes use of a matrix struct that saves the number of rows, the number of columns and the data.
the file `solver.cpp` implements multiple methods to operate on the matrices.

The order of operations should not be altered:

1) Create the matrices A and B
2) Populate the matrices A and B with their resprective values
3) Create a third matrix C
4) Multiply A and B and save the result in C
5) Create the coefficient matrix and populate it with values
6) Create the bound vector and populate it with values
7) Create a result matrix
8) Call the solve method and execute the solver

The program can be build using the `builder.sh` script