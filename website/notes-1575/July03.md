

Date: 2023-07-03
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=42500e79-7aa3-4bb1-8b1a-b0340139f606

Reminders:
* [ ] Pa03 live
* [ ] Quiz 3 is due tonight
* [ ] no lecture tomorrow

Objectives:
* [ ] start recursion

---

# What is Recursion

Click here for an explanation: [[Recursion]]


Just kidding. Recursion is a means of mathematical definition in which one or more components or properties of an object are defined in terms of the object itself.

For example, suppose you’ve been tasked with formally defining the set of natural numbers to a room of very uptight mathematicians. 
You might give the answer:
  _1, 2, 3, 4, ..._
But this isn’t good enough for the mathematicians, you just gave some examples not a formal description!

You might try again with something like:
  _A natural number is a positive number without decimals_
While this is true of all natural numbers, the crowd still won’t be satisfied unless you define the words _positive_ and _decimal_! 🤓

You finally decide to use a **recursive definition**:
  * 1 is a natural number
  * _n_ is a natural number if and only if _n-1_ is a natural number
And the mathematicians nod in approval

Every recursive definition will have two components:
* One or more **Base Cases** - statements that give a direct answer/result
* One or more **Recursive Cases** - statements that give an indirect answer in terms of the object in question

---
# Recursion as a Problem-Solving Tool

So why do we care? Well as computer scientists, our particular flavor of “problem-solving” revolves around simply giving a very careful and precise definition of the problem at hand. It may be unsurprising, therefore, that recursion is not only deeply ingrained into the theory of computer science, it is also a powerful tool to apply towards high-level problems.


In a recursive algorithm, we take the _global_ problem to be solved and formulate it in terms of smaller _sub-problems_ that are easier to solve but still have the same structure as the global. It relates to the classic problem-solving strategy of _Divide-and-Conquer_. 

For this we give very similar definitions to mathematical recursion:
* **Base Case** - an instance of the problem that can be solved directly
* **Recursive Case** - a _Decomposition_ of the problem into smaller instances, along with a complete solution _Composed_ from the smaller solutions

Here, _smaller_ means that it must make some amount of progress toward a directly solvable _Base Case_, otherwise our algorithm would never end!

base^power

How would you write an iterative algorithm?

result = 1;
for( int i = power; i > 0; i--)
  result = result * base

* [ ] ben n
* [ ] sarah
* [ ] kilian
* [ ] daniel
* [ ] garret w
  

Let’s write a recursive algorithm for computing exponents
- What is our _Base Case(s)?_ power = 0; power = 1;
- What is our _Recursive Case(s)?_  2^n -> 2^(n-1) * 2

  2^n -> 2^(n/2)*2^(n/2)
  2^n -> 2^(n/2)*2^(n/2)*2

* [ ] garret w
* [ ] sarah
* [ ] ben w
* [ ] ben n
      
[[examples/recursion-exponentiation]]
<!-- #include [[examples/recursion-exponentiation]] -->
```c++
int pow(int base, int power)
{
  if (power == 0)
    return 1;
  if (power == 1)  // Base Cases
    return base;

  int half_power = pow(base, power/2); // Recursive Case
  if (n % 2 == 0)
    return half_power*half_power; // Composition
  else
    return half_power*half_power*base; // Account for int division /
}
```
<!-- /include -->


What is the time complexity of our algorithm?

(2^13)
(2^6) * 2^6 * 2
(2^3) * 2^3
2^1 * 2^1 * 2^1

* [ ] kilian
