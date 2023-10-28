

Date: 2023-10-27


Reminders:
* [ ]  [[PA04]] assigned 

Objectives:
* [ ] finish [[Recursion]]

---


# The Efficiency of Recursion

We’ve seen how recursion is a powerful tool for helping us think about problems differently and create elegant solutions, but how does it relate to the efficiency of our programs?

## When Recursion goes wrong

A classic example of recursion is that of the _Fibonacci Sequence_

  _1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ..._

Where the i-th Fibonacci number is the sum of the two previous, with the exception that the first and second numbers are _1, 1_

This is so often to introduce recursion to programmers because it’s so simple. The i-th Fibonacci number is so clearly recursively defined that the algorithm practically writes itself!

```c++
int fib(int i) // return the i-th Fibonacci number
{
  if (i == 1 || i == 2) // Base Cases
    return 1;

  return fib(i-1) + fib(i-2); // Recursive Case
}
```

However, those programmers (hopefully) then come to learn that this algorithm is horribly inefficient and are taught a much better iterative algorithm to use instead.

So what gives? Why is something so quintessentially recursive in nature such a bad candidate for a recursive algorithm?
* **Are all recursive algorithms _horribly inefficient_?** (no)
* **Should we always try to use iteration instead?** (not necessarily)
* **Is recursion _scary_?** (not if you understand where fib() goes wrong)

What you need to avoid in a recursive algorithm is _redundant sub-problems_. Taking a _top-down_ approach (starting at fib(i) and working towards the base case of fib(1) or fib(2)) causes you to re-compute a lot of information that you already know.

fib(6) makes a call to fib(5), then a call to fib(4). However, the 4th Fibonacci number was already calculated in the call to fib(5)! 

![](img%2Ffib.png)
This wasteful re-calculation very quickly gets out of hand, and it’s why a _bottom-up_ approach like the iterative algorithm is the correct choice.

Note that there is a technique in the field of _Dynamic Programming_ for tackling this problem of redundant sub-problems known as _memoization_, but it is beyond the scope of this course.

## The hidden cost of a function

Even if a recursive and iterative version of an algorithm have the same _analytical_ time-complexity, you may often find that the iterative version outperforms _empirically._ This is because of another consideration for recursive algorithms which is the cost of maintaining the _call stack_.

Remember that every time we make a function call, a _stack frame_ is generated with information about the current state of the program before the new function takes control. This takes a non-trivial amount of time to do, but we disregard it during analytical testing as it is technically environment-dependent and does not have an effect on rate-of-growth.

What this tells us is that while recursive algorithms are good enough for most purposes and can offer significantly increased readability/maintainability, if speed is your primary concern you may look for an iterative equivalent.

## Recursion is looping, looping is Recursion

It may not come as a surprise that iteration and recursion are often two sides of the same coin. After all, loops in C++ can be thought of as shorthand for recursive functions.

```c++
for( init ; test ; update )
{
  body
}

void loop(i)
{
  if (test(i) == false)
    return

  body(i)
  loop(update(i))
}
```

```c++
while (test)
{
  body
}

void loop()
{
  if (test == false)
    return

  body
  loop()
}
```

This is not actually how looping works in C++, but you can see how they are logically equivalent for solving problems. That is why simple recursive algorithms are often interchangeable with their iterative counterparts.

However, for more some recursive algorithms there is not always an obvious iterative equivalent. In these instances, if we want a non-recursive algorithm that behaves the same we need to _simulate_ recursion by replacing the _call stack_ with a stack of our own.

```c++
int fake_recursive_factorial(int n)
{
  vector<int> stack;
  int result = 1;
  while(n > 1)  // simulating recursive calls
  {
    stack.push_back(n);
    n--;
  }
  while(!stack.empty()) // simulating those functions returning
  {
    result *= stack.back();
    stack.pop_back();
  }

  return result;
}
```

This is a sometimes helpful optimization to make when the amount of information passed between recursive calls is relatively small and is often employed for tree/graph _traversals_.

---
# Recursive Backtracking

Another interesting use for recursion is for solving multi-step problems via systematically _guessing_ the right answer for each step and _backtracking_ to a previous step when it becomes clear that a mistake has been made. While this approach is not always the most efficient approach, it is still a clever improvement over blindly _brute-forcing_ a solution as it can allow us to avoid testing combinations of steps that we know won’t lead to the solution.

It relates to the classic problem-solving technique _Trial-and-Error_ and can be applied to puzzles, mazes, decision-making games, and more! A classic example of a game where recursive backtracking is applied is the _n-Queens_ problem.

The **N-Queens problem** is as follows:
  _Given a n-by-n chessboard, place n queen pieces such that no two queens can attack each other_

Pseudocode for the _n-Queens_ problem:
```
1. try-queen(int row):
2.   int col <- first valid column
3.   while valid columns remaining
4.     place i-th queen at `col`
5.     if no more queens
6.       return success
7.     trial <- try-queen(i+1)
8.     if trial is success
9.       return success
10.     else
11.       retract i-th queen placement
12.      col <- next valid column
13.   return failure
```

Try to follow the algorithm yourself [here](http://eightqueen.becher-sundstroem.de/). Visualize each row as it’s own recursive function call and picture the call stack as you go.

