"""
**************************************************************************
*  Simple script to parse a given result.csv generated trough the spear  *
*  viewer analysis                                                       *
*                                                                        *
*  Author: Maximilian Krebs                                              *
**************************************************************************
"""

import csv
import numpy as np
import matplotlib.pyplot as plt


# Require the path to the result csv from the user
print("Path to result.csv")
filename = input()

# Open the file
with open(filename, 'r') as data:
    tasks_used=list()
    results={}
    stats={}
    # Get a dict reader to read in the data
    rawcsv=csv.DictReader(data)

    # Get the used taks by querying the keys of the dict represented by the csv file
    tasks_used=rawcsv.fieldnames 

    # Init our data saving structures
    for task in tasks_used:
        results[task]=list()
        stats[task]={}

    # Parse the file, convert the values to float and save it in the results dict
    for row in rawcsv:
        for task in tasks_used:
            results[task].append(float(row[task]))

    # Construct the plots, one for each task
    fig, axs = plt.subplots(1, len(tasks_used), sharey='row', figsize=(15, 5))
    
    i=1
    for task in tasks_used:
        # Get the energy measures for each task
        edata = results[task]

        # Calculate some statistical values
        avg = np.average(edata)
        std_dev = np.std(edata)

        # Fill the plots with values
        # We need to reference the plots by i-1, as our tasks start at i and the plots start at 0
        axs[i-1].boxplot(edata, showfliers=False)
        axs[i-1].set_title(task)
        axs[i-1].set_xlabel("Sample")
        axs[i-1].set_ylabel("Energy used in J")
        

        # Construct a errorbar from the standard deviation and a error point marking the average value
        axs[i-1].plot(1, avg, 'ro')
        axs[i-1].errorbar(1, avg, yerr=std_dev, fmt='o', color='red')

        # Collect the calculated statistical data
        stats[task] = { "average": avg, "standard deviation": std_dev}

        i = i + 1
    
    # Print the stats
    print(stats)

    # Show the plots
    plt.tight_layout()
    plt.show()
