import os
import subprocess
import shlex
import struct
import numpy as np
import matplotlib.pyplot as plt
import csv

REPEATEDEXECUTIONS=10000


def readRapl():
    registerpath = "/dev/cpu/{}/msr".format(1)
    energyreg = 0x639
    unitreg = 0x606

    energy = 0
    unit = 0

    with open(registerpath, 'rb') as rf:
        rf.seek(energyreg)
        rawenergy = rf.read(8)
        energy = struct.unpack('L', rawenergy)
        cleaned_energy = energy[0]

        rf.seek(0)
        rf.seek(unitreg)
        rawunit = rf.read(8)
        unit = struct.unpack('Q', rawunit)[0]
        cleaned_unit = (unit >> 8) & 0x1F

    return cleaned_energy * pow(0.5, cleaned_unit)

def clean(path):
    if os.path.exists(path):
        print("\t-> Cleaning")
        builderPath = "{}/builder.sh clean".format(path)
        sub = subprocess.Popen(shlex.split(builderPath), cwd=path, stdout=open(os.devnull, 'wb'))
        sub.communicate()
    else:
        print("Something went wrong. The path could not be found...")

def compile(path):
    if os.path.exists(path):
        print("\t-> Building")
        builderPath = "{}/builder.sh build".format(path)
        sub = subprocess.Popen(shlex.split(builderPath), cwd=path, stdout=open(os.devnull, 'wb'))
        sub.communicate()
    else:
        print("Something went wrong. The path could not be found...")

def execute(path, name, arg):
    if os.path.exists(path):
        print("\t-> Running")
        if arg != "":
            builderPath = "echo {} | {}/{}".format(arg, path, name)
        else:
            builderPath = "{}/{}".format(path, name)

        energyseries = list()
        for i in range(0, REPEATEDEXECUTIONS):
            energyBefore = readRapl()
            sub = subprocess.Popen(shlex.split(builderPath), cwd=path, stdout=open(os.devnull, 'wb'))
            sub.communicate()
            energyAfter = readRapl()
            energyseries.append(energyAfter - energyBefore)

        #average = np.average(energyseries)
        #std_deviation = np.std(energyseries)
        #maximum = np.max(energyseries)
        #minimum = np.min(energyseries)
        #print("\t\t ====> Programm used on average {} J per execution".format(average))
        #print("\t\t ====> Standard deviation {} J".format(std_deviation))
        #print("\t\t ====> Max {} J".format(maximum))
        #print("\t\t ====> Min {} J".format(minimum))
        return energyseries
    else:
        print("Something went wrong. The path could not be found...")


print("Path to tasks")

democodeString = input()

if democodeString:
    tasks_used = list()
    
    for i in range (1,7,1):
        task = f"task_{i}"
        path = os.path.abspath(f"{democodeString}/{task}")
        if os.path.exists(path):
            tasks_used.append(task)
    
    fig, axs = plt.subplots(1, len(tasks_used), figsize=(15, 5))
    i=1
    dataagg={}

    for task in tasks_used:
        path = os.path.abspath(f"{democodeString}/{task}")
        print("Running {})".format(task))
        clean(path)
        compile(path)
        edata = execute(path, f"target/{task}", "")
        dataagg[task]=edata

        mean = np.mean(edata)
        std_dev = np.std(edata)
        print("\t-> Done!")
        axs[i-1].boxplot(edata, showfliers=False)
        axs[i-1].set_title(task)
        axs[i-1].set_xlabel("Sample")
        axs[i-1].set_ylabel("Energy used in J")
        axs[i-1].plot(1, mean, 'ro')
        axs[i-1].errorbar(1, mean, yerr=std_dev, fmt='o', color='red')

        i = i + 1

    with open("result.csv", "w") as outfile:
 
        # pass the csv file to csv.writer function.
        writer = csv.writer(outfile)
    
        # pass the dictionary keys to writerow
        # function to frame the columns of the csv file
        writer.writerow(dataagg.keys())
    
        # make use of writerows function to append
        # the remaining values to the corresponding
        # columns using zip function.
        writer.writerows(zip(*dataagg.values()))
    

    # Creating plot
    #mean = [np.mean(d) for d in data]
    #std_devs = [np.std(d) for d in data]

    #plt.boxplot(data, labels=labels, vert=True)
    #for i in range(len(mean)):
        #plt.plot(i + 1, mean[i], 'ro')
    # Adds standard deviations as error bars
    #for i in range(len(std_devs)):
        #plt.errorbar(i + 1, mean[i], yerr=std_devs[i], fmt='o', color='red')

    #plt.title(f"Execution of tasks using {REPEATEDEXECUTIONS} repeated executions")
    #plt.xlabel('Task executed')
    #plt.ylabel('Used energy in J')

    # show plot
    plt.tight_layout()
    plt.show()
else:
    print("Please insert a number between 1 and 6")
