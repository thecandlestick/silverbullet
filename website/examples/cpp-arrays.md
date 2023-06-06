basics
```c++
#include <iostream>
using namespace std;

int main()
{
  int foo [] = {16, 2, 77, 40, 12071};
  int n, result = 0;

  for ( n=0 ; n<5 ; ++n )
  {
    result += foo[n];
  }
  cout << result;
  return 0;
}
```
arrays as parameters
```c++
#include <iostream>
using namespace std;

void printarray(int arg[], int length)
{
  for (int n=0; n<length; ++n)
    cout << arg[n] << ' ';
  cout << endl;
}

int main()
{
  int firstarray[] = {5, 10, 15};
  int secondarray[] = {2, 4, 6, 8, 10};
  printarray(firstarray, 3);
  printarray(secondarray, 5);

  return 0;
}
```
multidimensional arr
![2D Array](two-d-arr.png)
