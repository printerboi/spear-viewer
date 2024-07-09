import os
import subprocess
import shlex
import struct



REPEATEDEXECUTIONS=5000


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

        energy = 0.0
        for i in range(0, REPEATEDEXECUTIONS):
            energyBefore = readRapl()
            sub = subprocess.Popen(shlex.split(builderPath), cwd=path, stdout=open(os.devnull, 'wb'))
            sub.communicate()
            energyAfter = readRapl()
            energy = energy + (energyAfter - energyBefore)

        average = energy/REPEATEDEXECUTIONS
        print("\t\t ====> Programm used on average {}J per execution".format(average))
    else:
        print("Something went wrong. The path could not be found...")


print("Which democode should be run?")
print("\t (1) Gauss-seidel solver")
print("\t (2) OpenSSL encrypt")
print("\t (3) OpenSSL handshake")
print("\t (4) Raytracer")
print("\t (5) SHA256 calculator")
print("\t (6) Weather data")

democodeString = input()
democodeNumber = int(democodeString) if democodeString.isdecimal() else None

if democodeNumber and democodeNumber > 0 and democodeNumber <= 6:
    if democodeNumber == 1:
        print("Running demo {})".format(democodeNumber))
        path = os.path.abspath("../code/gauss-seidel-solver")
        clean(path)
        compile(path)
        execute(path, "target/gauss-seidel-solver", "")

    if democodeNumber == 2:
        print("Running demo {})".format(democodeNumber))
        path = os.path.abspath("../code/openssl-encrypt")
        clean(path)
        compile(path)
        execute(path, "target/openssl-encrypt", "")

    if democodeNumber == 3:
        print("Running demo {})".format(democodeNumber))
        path = os.path.abspath("../code/openssl-handshake")
        clean(path)
        compile(path)
        execute(path, "target/openssl-handshake", "www.wikipedia.org")

    if democodeNumber == 4:
        print("Running demo {})".format(democodeNumber))
        path = os.path.abspath("../code/raytracer")
        clean(path)
        compile(path)
        execute(path, "target/raytracer", "wikipedia.org")

    if democodeNumber == 5:
        print("Running demo {})".format(democodeNumber))
        path = os.path.abspath("../code/sha256-calculator")
        clean(path)
        compile(path)
        execute(path, "target/sha256-calculator", "")

    if democodeNumber == 6:
        print("Running demo {})".format(democodeNumber))
        path = os.path.abspath("../code/weather-data")
        clean(path)
        compile(path)
        execute(path, "target/weather-data", "")

    print("\t-> Done!")
else:
    print("Please insert a number between 1 and 6")
