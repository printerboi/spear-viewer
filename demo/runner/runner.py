"""
**************************************************************************
*  Script to execute a set of tasks and measure the used energy          *
*                                                                        *
*  Author: Maximilian Krebs                                              *
**************************************************************************
"""

import os
import subprocess
import shlex
import struct
import numpy as np
import matplotlib.pyplot as plt
import csv

# Define the number of times the execution will be repeated
REPEATEDEXECUTIONS=10000


# Reads the RAPL energy registers from the CPU
def readRapl():
    # Path to the msr file under linux
    registerpath = "/dev/cpu/{}/msr".format(1)

    # Define the address of the registers
    energyreg = 0x639
    unitreg = 0x606

    energy = 0
    unit = 0

    # Open the msr file
    with open(registerpath, 'rb') as rf:
        # Jump to the defined address
        rf.seek(energyreg)
        # Read 8 bytes as the raw energy counter
        rawenergy = rf.read(8)
        energy = struct.unpack('L', rawenergy)
        cleaned_energy = energy[0]

        # Jump to the unit address
        rf.seek(0)
        rf.seek(unitreg)
        # Read the unit value
        rawunit = rf.read(8)
        unit = struct.unpack('Q', rawunit)[0]
        cleaned_unit = (unit >> 8) & 0x1F

    # Calculate the used energy in joule by applying the following formula
    return cleaned_energy * pow(0.5, cleaned_unit)

# Cleans the build directory of a given task
def clean(path):
    if os.path.exists(path):
        print("\t-> Cleaning")
        # Call the builder script to clean
        builderPath = "{}/builder.sh clean".format(path)
        sub = subprocess.Popen(shlex.split(builderPath), cwd=path, stdout=open(os.devnull, 'wb'))
        sub.communicate()
    else:
        print("Something went wrong. The path could not be found...")

# Compile a given task
def compile(path):
    if os.path.exists(path):
        print("\t-> Building")
        # Call the builder script to build
        builderPath = "{}/builder.sh build".format(path)
        sub = subprocess.Popen(shlex.split(builderPath), cwd=path, stdout=open(os.devnull, 'wb'))
        sub.communicate()
    else:
        print("Something went wrong. The path could not be found...")

# Execute a given task
def execute(path, name, arg):
    if os.path.exists(path):
        print("\t-> Running")

        # Construct the path of the task
        if arg != "":
            builderPath = "echo {} | {}/{}".format(arg, path, name)
        else:
            builderPath = "{}/{}".format(path, name)

        # Init the list of energy values
        energyseries = list()

        # Perform the execution multiple times, as defined in the contants
        for i in range(0, REPEATEDEXECUTIONS):
            # Read the energy counter before the execution
            energyBefore = readRapl()
            # Execute the given task
            sub = subprocess.Popen(shlex.split(builderPath), cwd=path, stdout=open(os.devnull, 'wb'))
            sub.communicate()
            # Read the energy counter after the execution
            energyAfter = readRapl()

            # Save the absolute used energy during the excution to the energy series
            energyseries.append(energyAfter - energyBefore)

        return energyseries
    else:
        print("Something went wrong. The path could not be found...")


# Aquire the path to the tasks from the user
print("Path to tasks")
democodeString = input()

if democodeString:
    tasks_used = list()
    
    # Iterate over the possible 6 tasks 
    for i in range (1,7,1):
        # Construct the task name
        task = f"task_{i}"
        # Construct the path the specific task
        path = os.path.abspath(f"{democodeString}/{task}")

        # Check if the constructed path exist
        # If the participant edited the task, there will be a valid path
        if os.path.exists(path):
            tasks_used.append(task)
    
    # Construct the plots from the valid taks
    fig, axs = plt.subplots(1, len(tasks_used), figsize=(15, 5))
    # Task energy series dict
    dataagg={}

    # Iterate over the valid tasks
    for task in tasks_used:
        # Construct the path to the task
        path = os.path.abspath(f"{democodeString}/{task}")
        print("Running {})".format(task))
        # Clean the build dir
        clean(path)
        # Compile the task
        compile(path)
        # Execute the task repeatedly
        edata = execute(path, f"target/{task}", "")
        # Save the measurements to the task dict
        dataagg[task]=edata

    # Write the task energy series dict to a csv file
    with open("result.csv", "w") as outfile:
        writer = csv.writer(outfile)
        writer.writerow(dataagg.keys())
        writer.writerows(zip(*dataagg.values()))
    
else:
    print("Please insert a path to a folder containing task_x folders")
