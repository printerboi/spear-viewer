#include <iostream>
#include <string>

#include "includes/csv_reader.h"
#include "includes/sensorInterface.h"

int main(){

    auto temps = read_in_temps("temps.csv");
    print_sensor_values(757, temps);
    return 0;
}
