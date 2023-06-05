
Day 1! 🥳

Stuff to do today:
* [x] Syllabus
* [x] Introduce PA00
* [x] Practice env setup

https://www.cnsr.dev/index_files/Classes/DataStructuresLab/Content/00-VirtualMachines.html

**Lecture Recording:** https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=988a09c2-fa41-4e07-bc7e-b018013dd5eb 

---

<!-- #include [[Syllabus]] -->
# Contact
email: jackmanhardt@mst.edu

## Meeting Times
12:40pm - 1:40pm M-F
Zoom Link: https://umsystem.zoom.us/j/99894801988?pwd=UzV3U1FXVlJIRXB5U1dVekQ4azhYQT09


## Office Hours
1:40pm - 3:00pm M-F
Individual meetings by appointment

---

# Grading
The number and weighting of assignments is tentative and may change

Homework - 700 points
Weekly Quizzes - 240 points
Syllabus Quiz - 60 points
_Total: 1000 points_

## Assignments
There will be 8 total homework assignments, primarily C++ coding-based. Your lowest homework score will be dropped.

There is _no_ midterm exam and _no_ final exam

## Extra Credit
There will be daily opportunities for extra credit, all requiring attendance and participation at the lecture.

You may earn a maximum of 10 extra credit points per week, with no limit on daily or total amount earned. **Two or more unexcused absences during a week will forfeit any extra credit earned**, please email prior to class for exemptions.

The following actions are worth 2 points each:
* Answering a knowledge-check in class _(don’t have to be correct)_
* Participating in a discussion question
* Correctly identifying a mistake with the course material
* Asking a high-quality question _(must be meaningful and further class understanding on a topic)_

Please stay in the zoom meeting after class to claim extra credit for the day.

## Autograder ([grade.sh](https://gitlab.com/classroomcode/grade-sh/grade-sh))
Your assignments in this course will be graded by an open-source autograding tool developed right here at S&T. Some exciting features include the ability to receive ==immediate feedback== on your current progress and built-in tools to help you incrementally develop your code.

---

# Resources

## Textbooks

[Efficient Data Structures](https://www.cnsr.dev/index_files/Classes/DataStructures/Content/eds-cpp.pdf) by Patrick Taylor
(Adapted from [Open Data Structures](https://opendatastructures.org/))

[Data Structures and Algorithm Analysis](https://www.cnsr.dev/index_files/Classes/DataStructures/Content/DSA_Shaffer2013.pdf) by Clifford A. Shaffer

## Helpful Stuff

[[Course Calendar]] 

[[SS23 CS1575|Course Index]]

[WSL Tutorial](https://learn.microsoft.com/en-us/training/modules/wsl/wsl-introduction/)

---

# Policies

## Attendance
This course is online-synchronous, so regular attendance at the lectures is expected. I understand during the Summer session some students juggle work as well, so please contact me _in advance_ about schedule conflicts. Unexcused absences will drop your grade and exclude you from extra credit opportunities.

## Late Work
No late work will be accepted once the assignment repositories close. Because the summer session is only 8 weeks, there will be no time for resubmissions and make-ups so please keep up with assignments and do not expect extensions.

## Academic Honesty
All code submitted must be 100% your own work!
Do not copy code from the internet, fellow students, or Large Language Models. Submitted assignments **will** be checked for plagiarism at times throughout the semester, and any instances of academic dishonesty will result in a score of zero with further action depending on severity. 

## Coding Standards
In this course, we will use an automatic code formatting tool (clang-format) to ensure a consistent style. You are encouraged to write quality comments alongside your code, but will not be graded on your documentation / organization.

[Official University-wide Policies](https://registrar.mst.edu/academicregs/conductofstudents/)
<!-- /include -->

<!-- #include [[PA00]] -->
Programming Assignment 0 - [PA00](https://git-classes.mst.edu/2023-ss-cs1575/pa00)

# Development Environment Setup

---

## Assignment Description:

For your first assignment, you’ll be tackling a million dollar problem 💰🤑💸 ! In May 24, 2000, The Clay Mathematics Institute the Millennium Prize Problems consisting of seven of the most challenging and important unsolved problems in all of Mathematics.

One of the most famous problems is the [Collatz Conjecture](https://en.wikipedia.org/wiki/Collatz_conjecture), which is notable for being easy to understand but seemingly impossible to solve! It goes like this ...

```
Start with any positive integer (i)
  while i is greater than 1
    if i is even, divide it by 2
    else, multiply i by 3 and add 1

EX: 42 -> 21 -> 64 -> 32 -> 16 -> 8 -> 4 -> 2 -> 1
```

Lothar Collatz conjectured that the process will _eventually_ reach 1 for _any_ positive integer starting point, but it has never been proven despite nearly a century of work and a $1,000,000 incentive!

Your assignment will have you compute the **total stopping time** of an integer, which is the number of iterations it takes to reach 1. For example, 42 has a total stopping time of 8 as illustrated above.

## Input / Output:

The input will consist of an integer _n_ followed by _n_ integers _k_, where 1 <= _k_ <= 10,000.

For each integer _k_, compute the _total stopping time_ (t) and output 
```
Total stopping time of <t>
```

### Sample I/O:

| Input | Output |
|----------|----------|
| 3 |  |
| 1 | Total stopping time of 0 |
| 9 | Total stopping time of 19 |
| 1024 | Total stopping time of 10 |

## Scoring:

To get full points on the assignment...
* Implement the Collatz Function in _Collatz.h_ **(unit_tests)**
* Complete the _main()_ function to compute the total stopping times for a collection of integers **(stdio_tests)**
* Address any warnings given by cppcheck **(static analysis)**
* Format your code using the clang-format utility **(style check)**

<!-- #include [[Grade dot sh]] -->
# General information regarding this repository

## Coding
Tips for coding.

### What to name my files?
We give you empty files corresponding to those you should complete!

### Where to code?
We assume you're on a Linux machine, and can install all the software needed by this auto-grader.
See the syllabus for more details.

### How to get this code?
Find the blue button that says "clone", on the home page of this repository.
If you have an ssh key set up:
 `git clone git@... `
If you don't have an ssh set up, or know what that is:
 `git clone https://.. `

### Where to read this file?
This file is nicely displayed in the Gitlab web interface, but you can read it wherever.

### What to install?
See the script's warnings.

### How to code?
Using this script, we strongly encourage you to program incrementally. 
Program code required by the unit tests, in the requested order. 
In general, don't proceed to a later function if you are not passing the first one.
If you get stuck, instead of moving on, get help!
See the syllabus for extended coding tips.

## Auto-grader

### How to run the auto-grader on your machine?
Run the following in the root directory of your repository:
 `./grade.sh `

## How to run the auto-grader on Gitlab-CI?
Make sure all your files are added, committed, and pushed to the appropriate branch (see Git section below).
Navigate to the Gitlab web interface to confirm these changes exist on the server.

## How to make sure I'm getting points?
 * Click on CI/CD -> Jobs -> the latest job.
 * Is it passing, green, etc? 
 * What grade does it say you have?
 * Whatever grade the latest job says, is what we think you have!

## std-io tests: differences between your std-out and the desired std-out
See:  `your _diffs/ ` and  `your _outputs ` to determine what went wrong. 
We run these diffs automatically, so you may not need to manually inspect these files.

## Unit tests: we're micromanaging your functions!
See the unit tests themselves, and run them in your favorite debugger:
 `unit _tests/ `

## Git
Git happens...

### add, commit, push
From within your git repository (folder), add, commit, and push all the non-generated files. 
This means add your cpp and png files, but not a.out, etc.
Verify you can see the files on git-classes in the web interface.
If you can see the correct files on git-classes in your master branch, your submission is complete.
Make sure all the requested files are in the root directory of the repository unless otherwise specified.

## Errors
You should not change any of the grading files themselves. 
If you do, you will see a warning, and it will give you a 0.
If you accidentally did that:
`git checkout firstfourcharactersoflastcommitbyus graderfileyoubroke`

### Is the auto-grader broken?
Is the error you're encountering our fault or yours?
Either may be possible, while the latter is a bit more likely.
Double-check all the diffs, and step through all code to see.
If you think you found a bug, please let us know!

## When is this due?
See the syllabus!

## grade.sh: this automated grading framework
For more details on the generalized auto-grader, see:
https://gitlab.com/classroomcode/grade-sh/grade-sh
<!-- /include -->
<!-- /include -->
