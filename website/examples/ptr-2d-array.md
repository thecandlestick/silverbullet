```c++
#include <iostream>
using namespace std;

int main()
{
  int **q;  // Dynamically allocating 3x4 grid
  q = new int*[3];
  for (int k = 0; k < 3; k++)
    q[k] = new int[4];

  q[1][1] = 0;
  q[2][3] = 4;

  //delete [] q;  BAD! Memory has been leaked
  for (int k = 0; k < 3; k++)
    delete [] q[k];
  delete [] q;  q = nullptr;  // Safely De-allocating

  return 0;
}