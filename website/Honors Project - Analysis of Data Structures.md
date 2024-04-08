
# Objective

The objective of this project is to apply the principles of analytical testing and algorithm complexity to the selection of various data structures. You will demonstrate, analytically and empirically, the effect of swapping data representations (using different data structures) on the efficiency of a program. 

This project is open-ended but intended for students wanting to develop a strong mathematical foundation in relation to data structures & algorithms

Some examples of projects falling into this category include:
* **Use-case comparison of data structures** - Taking a problem to be solved and comparing the performance of applying different data structures (_example: ArrayList vs LinkedList_). In this case, the _solution_ tested should be the same in every case, only the data structure storing relevant problem information should change.
* **Use-case comparison of abstract data types** - Taking a problem to be solved and comparing the performance of different solutions that make use of different abstract data types (_example: List vs Map_). In this case, the solutions used should be well thought out and motivated to ensure a meaningful comparison.
* **(Space complexity analysis of data structures)** - In-class analysis focuses on speed (time-complexity), but this option would explore the performance of data structures in terms of memory-consumption (space-complexity). A relevant problem-statement should be selected to demonstrate empirically the results of your analysis.

_You must confirm your choice of project with your instructor_

# Requirements

You will deliver a PDF report by the end of the semester with the following components:

### Problem Statement / Code Implementation

You must select your own problem statement for this project. The specific problem you choose to analyze does not matter, it does not even have to have a real-world impact. It must, however, be appropriate for demonstrating your understanding of the trade-offs involved in the selection of a data structure.

Once your problem is selected and approved, you can implement the solution(s) and data structure(s) involved in your project. Your code should be well commented

### Analytical Performance Analysis

You will perform a theoretical analysis of the implemented data structure(s) and proposed solution(s). This analysis should use asymptotic notation (Big-oh notation, Big-theta notation, and related techniques) and should contain a level of mathematical rigor beyond what is covered in class.

* Analyze each _operation_ used in the solution individually
* Analyze the _problem solution_ as a whole
* Estimate the total number of operations or total memory consumed for an input of size **n**

### Empirical Performance Analysis

You will then validate your analytical results by constructing a sufficiently large and varied _benchmark_ (collection of inputs) to test your implementation with. 

After capturing the results of your benchmark, you will compare this to your estimates made in the **analytical performance analysis** and reflect on what you have learned over the course of the project.

# Resources

* You can measure a program’s memory-usage with **Massif:** https://valgrind.org/docs/manual/ms-manual.html
* You can measure time/instruction-count using **Callgrind:** https://kcachegrind.sourceforge.net/html/Home.html
