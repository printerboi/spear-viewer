#! /bin/bash

EXECUTEABLE="openssl-encrypt"

if [ "$1" = "clean" ]; then
    if test -d target; then
        echo "Removing target dir..."
        rm -r target
        echo "Done!"
    else
        echo "Can't clean up the target dir, because it does not exist! Run build first."
    fi
elif [ "$1" = "profile" ]; then
    if test target/$EXECUTEABLE; then
        cd target
        valgrind --tool=callgrind --dump-instr=yes --simulate-cache=yes --collect-jumps=yes --callgrind-out-file="callgrind-report" ./$EXECUTEABLE
        kcachegrind ./callgrind-report
    else
        echo "Can't run profile, because the executeable does not exist! Run build first."
    fi
elif [ "$1" = "build" ]; then
    mkdir -p  target
    cd target
    cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo .. 
    make
else
    echo "Unknown subcommand! Usage:"
    echo -e "\t clean - Removes the target directory and therefore cleans up the build process."
    echo -e "\t build - Builds the prokect in a new directory target."
    echo -e "\t profile - Uses valgrind to profile the project. Requires a successfull build beforehand."
fi
