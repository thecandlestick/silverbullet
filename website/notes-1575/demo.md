

Date: 2023-11-15


Objectives:
* [ ] nitro memory management
* [ ] recursion

---


# Memory Management in C++

_When you create a variable, where does it go?_

## The Stack & the Heap 

[[snippet/variable-lifecycle]]
![variable lifecycle](img/variable-lifecycle.png)
![](img/memory_layout.png)


[[snippet/ops/cpp-new-delete]]

## _new_ Operator

(Dynamically) Allocates a new variable or array of variables to the heap and returns a ==pointer== to it

```my_pointer = new <type>``` used for dynamic variables

```my_pointer = new <type>[<size>]``` for dynamic arrays

## _delete_ Operator

Unlike local variables that get removed when leaving their scope, dynamic variables can persist indefinitely. It is therefore the _programmer’s_ responsibility to clean up after themselves. the _delete_ operator must be used to de-allocate a dynamic variable.

```delete <ptr>;```  used for dynamic variables

```delete [] <ptr>;```  used for dynamic arrays



[[snippet/stack-vs-heap]]

| Stack | Heap |
|----------|----------|
| Stores local (named) variables | Stores dynamic variables |
| Managed automatically by C++ | Managed by the programmer |
| Variables created at compile-time | Variables created at runtime |
| Variables exist within their scope | Variables exist until deallocated |


### Activation records and the Call-stack

_How does C++ manage function calls?_

The call-stack is used to manage the state of memory between function calls. It does so by organizing stack memory into **stack frames**, also known as **activation records**.

Each function call receives its own stack frame, and it contains information such as:

  * Arguments supplied to the function
  * Variables local to the scope of the function
  * A return address to where execution should resume afterwards

![the call stack](img/call-stack.png)
review material: [[Pointers]]

---
# Recursion

### Recursive definitions

_What is recursion?_

[[snippet/def/recursion]]
Recursion is a means of defining something in terms of itself.

Every recursive definition will have two components:
* One or more **Base Cases** - statements that give a direct answer/result
* One or more **Recursive Cases** - statements that give an indirect answer in terms of the object in question

### Recursive algorithms

_How do computer scientists apply recursion?_

[[snippet/def/recursive-algorithm]]
In a recursive algorithm, we take the _global_ problem to be solved and formulate it in terms of smaller _sub-problems_ that are easier to solve but still have the same structure as the global.

A _recursive algorithm_ consists of the following components:
* **Base Case(s)** - an instance of the problem that can be solved directly
* **Recursive Case(s)** - a _Decomposition_ of the problem into smaller instances, along with a complete solution _Composed_ from the smaller solutions

Here, _smaller_ means that it must make some amount of progress toward a directly solvable _Base Case_

[[examples/recursion-exponentiation]]
<!-- #include [[examples/recursion-exponentiation]] -->
_iterative_ implementation

```c++
int iterative_exp(int base, int power)
{
  int result = 1;
  for (int i = 0; i < power; i++)
  {
    result = result * base;
  }
  return result;
}
```

_recursive_ implementation

```c++
int recursive_exp(int base, int power)
{
  if (power == 0)
    return 1;
  if (power == 1)  // Base Cases
    return base;

  int half_power = recursive_exp(base, power/2); // Recursive Case
  if (power % 2 == 0)
    return half_power*half_power; // Composition
  else
    return half_power*half_power*base; // Account for int division /
}
```
<!-- /include -->


### Tracing recursion

_How do recursive algorithms work?_

[[snippet/tracing-recursion]]

It can be sometimes be difficult to envision where your code will go in a recursive algorithm, but we can easily keep track by remembering the call-stack.

This example uses the [[examples/recursion-exponentiation]] algorithm
```c++
int main()
{
  int n;
  n = recursive_exp(2, 7);
  std::cout<< n << std::endl;

  return 0;
}
```

![tracing recursion](img/tracing-recursion.png)

review: [[Recursion]]