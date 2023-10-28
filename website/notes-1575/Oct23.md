

Date: 2023-10-23


Reminders:
* [ ]  

Objectives:
* [ ] Continue recursion

---



In a recursive algorithm, we take the _global_ problem to be solved and formulate it in terms of smaller _sub-problems_ that are easier to solve but still have the same structure as the global. It relates to the classic problem-solving strategy of _Divide-and-Conquer_. 

For this we give very similar definitions to mathematical recursion:
* **Base Case** - an instance of the problem that can be solved directly
* **Recursive Case** - a _Decomposition_ of the problem into smaller instances, along with a complete solution _Composed_ from the smaller solutions

Here, _smaller_ means that it must make some amount of progress toward a directly solvable _Base Case_, otherwise our algorithm would never end!

Let’s write a recursive algorithm for computing exponents
- What is our _Base Case(s)?_
- What is our _Recursive Case(s)?_
  
[[examples/recursion-exponentiation]]
<!-- #include [[examples/recursion-exponentiation]] -->
```c++
int recursive_pow(int base, int power)
{
  if (power == 0)
    return 1;
  if (power == 1)  // Base Cases
    return base;

  int half_power = recursive_pow(base, power/2); // Recursive Case
  if (power % 2 == 0)
    return half_power*half_power; // Composition
  else
    return half_power*half_power*base; // Account for int division /
}
```
<!-- /include -->


---
# Tracing Recursion

It can be sometimes be difficult to envision where your code will go in a recursive algorithm, but we can easily keep track by remembering our good friend the call stack!

```c++
int factorial(int n)
{
  if (n == 1 || n == 0) // Base Cases
    return 1;
  int solution = n * factorial(n-1); // Recursive Case
  return solution;
}
```

![](img/factorial_trace.png)
```CS = []```

We can also think of execution with some helpful rules-of-thumbs:

* Code _before_ a recursive call will resolve before anything else
* Code _after_ a recursive call will resolve only **after all recursive calls** have returned. This means that the return statement of the _initial_ call is actually be the _last_ to be executed.


```c++
int recursive_pow(int base, int power)
{
  if (power == 0)
    return 1;
  if (power == 1)  // Base Cases
    return base;

  int half_power = recursive_pow(base, power/2); // Recursive Case
  if (power % 2 == 0)
    return half_power*half_power; // Composition
  else
    return half_power*half_power*base; // Account for int division /
}
```


_KC: Trace the execution of recursive_pow(2,65), how many total multiplications occur across all recursive calls? (do not try to calculate the value, just count the number of * operations) _

---
# Classifying Recursion

Recursion can come in several form:

* Linear - Single recursive call made per non-base case

* Multiple - Two or more (branching) recursive calls made 

* Indirect - FuncA() calls FuncB(), calls FuncA(), calls FuncB() ...


---
# A Blueprint for Recursive Algorithms

In general, all recursive algorithms follow the same basic structure:

```
recursive_function(X):

  if X is a base case:
    return solution_X

  else:
    Decompose(X) -> {x1, x2, ..., xn}
    solution_1 <- recursive_function(x1)
    solution_2 <- recursive_function(x2)
    ...
    solution_n <- recursive_function(xn)

    solution_X <- Compose(solution_1, solution_2, ..., solution_n)
    return solution_X
```

Of course, _n_ is often just 1 or 2 and the process of _Decompose()_ and _Compose()_ can take on many forms.

### The Tower of Hanoi

This is a very famous game involving moving stacks of increasingly sized rings around 3 or more pegs [Try it youself](http://towersofhanoi.info/Play.aspx)

It is a topic that has long inspired mathematicians and computer scientists alike as a very elegant example of the _magic_ of recursion.
Let’s tackle the challenge of writing an algorithm to produce a list of moves to solve the Tower of Hanoi

[[Tower of Hanoi]]
