## DEMO: Class based raytracer

This example shows the capabilities of the spear viewer regarding implementations using object oriented concepts.

The program generates a ppm image with a sphere in the center of the viewpoint.

### Attribution;

The demo code is based on the book [_Ray Tracing in One Weekend_](https://raytracing.github.io/books/RayTracingInOneWeekend.html)
by Peter Shirley et al. The implementation follows the first five chapters.

### Usage

Create a build dir and generate the build files using cmake. Afterwards build the projekt using make.
```
mkdir build
cmake ..
make
```
The compiled program can be executed by the following command
```
./raytracer
```

### Analysis

Open the project using a vscode instance running the spear-viewer. The `spear.yml` file should already be configured. The following step-by-step guide should yield an useable analysis:

1) Make sure spear and its dependencies are installed
2) Generate a profile using the spear sidebar
3) After the profile generation use the Button `SPEAR Analysis` in the bottom bar of the editor to generate the analysis data.
4) The results of the analysis should be automaticly focused and be visible in the SPEAR sidebar.