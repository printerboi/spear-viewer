//
// Created by maximilian on 05.07.24.
//

#ifndef SENSORINTERFACE_H
#define SENSORINTERFACE_H
#include <vector>

enum columns {
	JANUARY = 2,
	FEBRUARY = 3,
	MARCH = 4,
	APRIL = 5,
	MAY = 6,
	JUNE = 7,
	JULY = 8,
	AUGUST = 9,
	SEPTEMBER = 10,
	OCTOBER = 11,
	NOVEMBER = 12,
	DECEMBER = 13
};

//void read_from_sensor(int sensor_id, std::vector<std::vector<double>> data);

void print_sensor_values(int sensor_id, std::vector<std::vector<double>> data);

double calculate_average(int sensor_id, std::vector<std::vector<double>> data);

double calculate_min(int sensor_id, std::vector<std::vector<double>> data);

double calculate_max(int sensor_id, std::vector<std::vector<double>> data);

void constructSingleDataset(int index, std::vector<std::vector<double>> data, std::vector<double> *result);

#endif //SENSORINTERFACE_H
