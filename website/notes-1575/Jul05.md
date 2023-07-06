

Date: 2023-07-05
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=9cd3533a-e253-4016-8646-b036013f90af

Reminders:
* [ ] PA03 due friday
* [ ] disregard remove function

Objectives:
* [ ] continue recursion

---


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

---
# Tracing Recursion

It can be sometimes be difficult to envision where your code will go in a recursive algorithm, but we can easily keep track by remembering our good friend the call stack!  5! = 5 * 4! 

```c++
int factorial(int n)
{
  if (n == 1 || n == 0) // Base Cases
    return 1;
  int solution = n * factorial(n-1); // Recursive Case
  // 
  return solution;
}
```

![](img/factorial_trace.png)
```CS = [ ] <- top```

We can also think of execution with some helpful rules-of-thumb:

* Code _before_ a recursive call will resolve before anything else
* Code _after_ a recursive call will resolve only **after all recursive calls** have returned. This means lines of code in the _initial_ call can actually be the _last_ to be executed.

---
# Classifying Recursion

Recursion can come in several forms:

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

* base case - 1 disc / 0 disc
* recursive case - move n-1 tower to spare, move bottom disc to goal, move spare (n-1 tower) to goal

[[Tower of Hanoi]]
<!-- #include [[Tower of Hanoi]] -->
```
####
# 3 peg scenario
# start - peg containing all rings initially
# goal - peg to transfer all rings to
# other - leftover peg (not start or goal)
####
TOH ( numRings, start, goal, other )
  if numRings == 0
    return
  TOH ( numRings-1, start, other, goal ) # notice other/goal swap
  move(start, goal)                      # move bottom ring to goal
  TOH ( numRings-1, other, goal, start ) # move rest of rings to goal
```

**C++ Implementation**
```c++
#include <vector>
#include <utility>
using namespace std;

typedef pair<int,int> Move
typedef vector<Move> MoveList

#Define Start 0
#Define Goal 1
#Define Other 2

template <typename T>
void vector<T>::addMoves(const vector<T>& source)
{ insert( end(), source.begin(), source.end() );}

MoveList TOH( int numRings, int start, int goal, int other)
{
  MoveList moves;
  if (numRings == 0)
    return moves; //base case, no moves needed
  moves = TOH( numRings-1, start, other, goal ); 
  moves.push_back(Move(start, goal));
  moves.addMoves( TOH(numRings-1, other, goal, start) );

  return moves;
}

int main() 
{
  TOH(5, Start, Goal, Other);
}
```
<!-- /include -->



* [ ] sarah
* [ ] garret w
* [ ] ben n
* [ ] kilian
* [ ] duc
* [ ] doug

---
# Recursion and Data Structures

Some data structures are purposefully designed with recursion in mind, or just so happen to store data using a recursive structure.

There is a particularly deep body of data structures that use [[Trees]] to represent data, which are inherently recursive objects and thus lend themselves well to operations implemented by recursive algorithms.

We have already seen an example of a recursive data structure; however, when we noted that the _ListNode_ class alone is sufficient to implement the _List_ abstract data type. To think of these operations recursively, simply note that _m_next_ in this implementation points to either:
  * nullptr (**Base Case**)
  * a smaller (size n-1) list (**Recursive Case**)

![linked list](img/linklist-diagram.png)

As an exercise, how might you write a recursive version of the _Find_ or _Size_ operations for this particular list implementation?

[[examples/recursion-linkedlist-find]]

<!-- #include [[examples/recursion-linkedlist-find]] -->
```c++
LinkedList<T>* LinkedList<T>::find(const T& value)
{
  if (m_data == value)
    return this;
  if (m_next == nullptr)
    return nullptr;

  return m_next->find(value);
}
```
<!-- /include -->


* [ ] sarah
* [ ] duc
* [ ] garret w
* [ ] kilian
* [ ] tony

[[examples/recursion-linkedlist-size]]

<!-- #include [[examples/recursion-linkedlist-size]] -->
```c++
int LinkedList<T>::size()
{
  if (m_next == nullptr)
    return 1;

  return 1 + m_next->size();
}
```
<!-- /include -->

