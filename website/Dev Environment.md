
This page will walk you through some options for setting up your development environment. You must have a Linux environment that you control (the campus Linux machines accessible through SSH/Putty are not sufficient)

# Option 1: Personal Linux Installation

If you are already using a Linux-based operating system on your personal device, then you may use that. The assignments should be compatible with most common Linux distributions, but will require some software packages for which availability may differ.

If you choose this option, you are responsible for obtaining all required packages. See the section on Docker below to help ensure compatibility with minimal configuration.

# Option 2: Linux Virtual Machine

For many students, a virtual machine (VM) will be the preferred option. This will allow you to emulate a Linux machine on your device regardless of your native operating system. A VM also provides a safe _sandbox_ environment for you to experiment in, which is ideal for Linux beginners.

_For this option, you will need to install [VirtualBox](https://www.virtualbox.org/)_

## For Students Taking CS 1585

CS 1585 requires setup and makes heavy use of a linux VM. If you are taking or have taken this course, then you should be able to use that environment for CS 1575 as well.

Assuming you have set up a Debian VM, you can run the following commands to install all 1575-specific packages:

```bash
$ sudo apt-get install cmake python3-levenshtein clang-format valgrind pipx

$ python3 -m pipx ensurepath
$ pipx install valgreen
```

## Pre-made VM for non-1585 Students

A ready-made course VM is available for download [here](https://drive.google.com/file/d/1C1C919EU_jeohhL8vL6nTTiaOvPcafdA/view?usp=sharing)

First make sure that you have VirtualBox installed, then follow the steps below to import the VM:

![importing the VM](img%2FimportVM.png)
**Select the downloaded OVA file in the step below**
![select the downloaded OVA](img%2FselectOVA.png)
![default settings](img%2FsettingsVM.png)

**Take the time to adjust the settings below to the recommended (green) amount for your computer**
![adjust memory](img%2FsettingsVM-2.png)
![adjust video memory](img%2FsettingsVM-3.png)
**You can now start the VM and begin working**

Default user/password: classVM/cs1575

_Note: CS 1585 students are required to set-up their own VM. If you have not completed the lab on virtual machines, do not simply import this one or you will risk getting no points for that assignment_

---
## Docker

[Docker](https://www.docker.com/) is a tool that allows you to deploy a customized OS environment with no installation required. Provided inside the assignment repository is a _Dockerfile_ which will allow you to deploy and interact with the exact environment that your code will be graded in. This can be helpful if you do not wish to or cannot install the required packages.

Experienced MacOS or WSL users may use this Dockerfile to complete the assignments if they wish, but this process is still experimental and not officially supported yet. It is highly recommended that you set up a Linux VM even if you intend to try using Docker.