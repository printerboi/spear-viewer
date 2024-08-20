# SHA256 calculator

The SHA256-calculator will use the given `samplefile.txt` and calculates the SHA256 hash value.

The program uses openssl as library.

The order of operatons should not be changed:

1) Calculate the first hash value
2) Read the input file
3) Calculate the second hash value
4) Read the input file

Further information about the methods provided by openssl can be found [here](https://docs.openssl.org/master/man1/)