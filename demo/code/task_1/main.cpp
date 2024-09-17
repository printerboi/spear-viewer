
#include "includes/sorter.h"
#include <vector>

int main() {
    const int elements = 10;
    int arr[elements] = { 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 };

    std::vector<int> outputvec(arr, arr + sizeof arr / sizeof arr[0]);
    std::cout << "Array before execution:";
    for (int i = 0; i < outputvec.size(); i++){
        std::cout << outputvec.at(i) << " ";
    }
    std::cout << std::endl;

    sort(arr, 10);
    sort(arr, 10);

    std::cout << "Array after execution:";
    for (int i = 0; i < elements; i++){
        std::cout << arr[i] << " ";
    }
    std::cout << std::endl;

    return 0;
}