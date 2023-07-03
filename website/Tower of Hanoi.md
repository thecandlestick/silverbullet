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

**Bonus**
How many recursive calls will TOH(n, Start, Goal, Other) make? 
What does this tell you about the size of the returned MoveList?
Can you use that information to write a more efficient implementation?