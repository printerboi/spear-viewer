# SPEAR-Viewer

Welcome to the SPEAR-Viewer repository. The SPEAR-Viewer is a [Visual Studio Code](https://code.visualstudio.com/) extension build ontop of [LLVM](https://llvm.org/) and the [SPEAR](https://github.com/printerboi/spear) analysis tool. It adds functionality to VSC enabling developers to visualise the static energy analysis performed by SPEAR.

## Structure

Further information regarding details of the extension can be found in the following strucure:

- [Installation]() How to install the SPEAR Viewer
- [Usage]() How to use the SPEAR Viewer
- [Contributing]() How to contribute to the project
- [Licensing]() How to reuse the SPEAR Viewer

## Installation

Before installing the extension make sure you downloaded and installed SPEAR using the provided installation script.

### Before installing...
⚠️ The provided script uses apt as package manager and was currently only tested on Debian. If you want to use SPEAR and the SPEAR-Viewer a different distro please build the program yourself using the build process described in the SPEAR repository.


⚠️ SPEAR requires an Intel CPU with a architecture supporting the Intel RAPL hardware measurement sensors. See the following [list](https://web.eece.maine.edu/~vweaver/projects/rapl/rapl_support.html) for supported architectures.

### Installing the Extension

In order to install the extension download the `.vsix` file from the [releases](https://github.com/printerboi/spear-viewer/releases) section of this repository.

After downloading the file execute the following steps:

1) Open VSCode and navigate to the extension tab or press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd>

2) Click on the `...` above the search bar

3) Click "Install from VSIX" 

4) Search for the downloaded file

5) Enjoy

## Usage


## Contribute

Please feel free to open issues in this repository and create merge request if you like. Please respect, that I run this repository as side project and can only spend my time partly on developing SPEAR.

If you encounter a problem an want to create a issue, please describe your system and problem detailed as possible. A detailed explanation on how to reproduce the problem should be provided.


## Licensing

As SPEAR and the SPEAR-Viewer were created with the goal of improving the enviromental impact of software development, the usage, reuse in different projects etc. are free under the GPL-3.0 license. Please see the license supplied within this repository for further details