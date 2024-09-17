//
// Created by maximilian on 05.07.24.
//

#include "sensorInterface.h"

#include <iostream>

#include "../../../../../../../../usr/include/math.h"

void print_sensor_values(int sensor_id, std::vector<std::vector<double>> data) {
	int index = -1;
	for(int i = 0; i < data.at(0).size(); i++){
		int id = data.at(0).at(i);
		if(id == sensor_id){
			index = id;
		}
	}

	std::cout << "Printing temperatur data for station with id" << data.at(0).at(index) << " °C" << std::endl;
	std::cout << "January ====> " <<  data.at(columns::JANUARY).at(index) << " °C" << std::endl;
	std::cout << "February ====> " <<  data.at(columns::FEBRUARY).at(index) << " °C" << std::endl;
	std::cout << "March ====> " <<  data.at(columns::MARCH).at(index) << " °C" << std::endl;
	std::cout << "April ====> " <<  data.at(columns::APRIL).at(index) << " °C" << std::endl;
	std::cout << "May ====> " <<  data.at(columns::MAY).at(index) << " °C" << std::endl;
	std::cout << "June ====> " <<  data.at(columns::JUNE).at(index) << " °C" << std::endl;
	std::cout << "July ====> " <<  data.at(columns::JULY).at(index) << " °C" << std::endl;
	std::cout << "August ====> " <<  data.at(columns::AUGUST).at(index) << " °C" << std::endl;
	std::cout << "September ====> " <<  data.at(columns::SEPTEMBER).at(index) << " °C" << std::endl;
	std::cout << "October ====> " <<  data.at(columns::OCTOBER).at(index) << " °C" << std::endl;
	std::cout << "November ====> " <<  data.at(columns::NOVEMBER).at(index) << " °C" << std::endl;
	std::cout << "December ====> " <<  data.at(columns::DECEMBER).at(index) << " °C" << std::endl;
	std::cout << "================================================================================" << std::endl;
	std::cout << "Average: " <<  calculate_average(sensor_id, data) << " °C" << std::endl;
	std::cout << "Min: " <<  calculate_min(sensor_id, data) << " °C" << std::endl;
	std::cout << "Max: " <<  calculate_max(sensor_id, data) << " °C" << std::endl;

}

void constructSingleDataset(int index, std::vector<std::vector<double>> data, std::vector<double> *result) {
	result->push_back(data.at(columns::JANUARY).at(index));
	result->push_back(data.at(columns::FEBRUARY).at(index));
	result->push_back(data.at(columns::MARCH).at(index));
	result->push_back(data.at(columns::APRIL).at(index));
	result->push_back(data.at(columns::MAY).at(index));
	result->push_back(data.at(columns::JUNE).at(index));
	result->push_back(data.at(columns::JULY).at(index));
	result->push_back(data.at(columns::AUGUST).at(index));
	result->push_back(data.at(columns::SEPTEMBER).at(index));
	result->push_back(data.at(columns::OCTOBER).at(index));
	result->push_back(data.at(columns::NOVEMBER).at(index));
	result->push_back(data.at(columns::DECEMBER).at(index));
}

double calculate_average(int sensor_id, std::vector<std::vector<double>> data) {
	int index = -1;
	for(int i = 0; i < data.at(0).size(); i++){
		int id = data.at(0).at(i);
		if(id == sensor_id){
			index = id;
		}
	}

	std::vector<double> singledataset;
	constructSingleDataset(index, data, &singledataset);

	double sum  = 0.0;
	for(int i = 0; i < singledataset.size(); i++){
		sum += singledataset.at(i);
	}

	return sum / 12;
}

double calculate_min(int sensor_id, std::vector<std::vector<double>> data) {
	int index = -1;
	for(int i = 0; i < data.at(0).size(); i++){
		int id = data.at(0).at(i);
		if(id == sensor_id){
			index = id;
		}
	}

	std::vector<double> singledataset;
	constructSingleDataset(index, data, &singledataset);

	double min  = INFINITY;
	for(int i = 0; i < singledataset.size(); i++){
		if(singledataset.at(i) < min){
			min = singledataset.at(i);
		}
	}

	return min;
}

double calculate_max(int sensor_id, std::vector<std::vector<double>> data) {
	int index = -1;
	for(int i = 0; i < data.at(0).size(); i++){
		int id = data.at(0).at(i);
		if(id == sensor_id){
			index = id;
		}
	}

	std::vector<double> singledataset;
	constructSingleDataset(index, data, &singledataset);

	double max  = -INFINITY;
	for(int i = 0; i < singledataset.size(); i++){
		if(singledataset.at(i) > max){
			max = singledataset.at(i);
		}
	}

	return max;
}