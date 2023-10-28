

Date: 2023-10-25


Reminders:
* [ ]  

Objectives:
* [ ] continue recursion

---


### The Tower of Hanoi

This is a very famous game involving moving stacks of increasingly sized rings around 3 or more pegs [Try it yourself](http://towersofhanoi.info/Play.aspx)

It is a topic that has long inspired mathematicians and computer scientists alike as a very elegant example of the _magic_ of recursion.
Let’s tackle the challenge of writing an algorithm to produce a list of moves to solve the Tower of Hanoi

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


---
# Recursion and Data Structures

Some data structures are purposefully designed with recursion in mind, or just so happen to store data using a recursive structure.

There is a particularly deep body of data structures that use [[Trees]] to represent data, which are inherently recursive objects and thus lend themselves well to operations implemented by recursive algorithms.

We have already seen an example of a recursive data structure; however, when we noted that the _ListNode_ class alone is sufficient to implement the _List_ abstract data type. To think of these operations recursively, simply note that _m_next_ in this implementation points to either:
  * nullptr (**Base Case**)
  * a smaller (size n-1) list (**Recursive Case**)

![linked list](img/LL-diagram.png)
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
