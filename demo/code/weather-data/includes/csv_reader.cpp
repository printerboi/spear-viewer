//
// Created by maximilian on 05.07.24.
//

#include "csv_reader.h"

#include <fstream>
#include <sstream>

std::vector<std::vector<double>> read_in_temps(std::string filename){
	std::vector<std::vector<double>> result;

	std::ifstream fileStream(filename);
	if(fileStream.is_open()){
		std::string line;
		std::string column;

		double value;

		if(fileStream.good()){
			std::getline(fileStream, line);

			std::stringstream lineStream(line);

			while(std::getline(lineStream, column, ',')){
				std::vector<double> row;
				result.push_back(row);
			}
		}

		while(std::getline(fileStream, line)){
			std::stringstream lineStream(line);

			int columnIdentifier = 0;

			while(lineStream >> value){
				result.at(columnIdentifier).push_back(value);
				if(lineStream.peek() == ','){
					lineStream.ignore();
				}

				columnIdentifier++;
			}
		}
	}

	return result;
}

