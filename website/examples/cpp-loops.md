while loops
```c++
#include <iostream>
using namespace std;

int main()
{
  int n = 10;

  while( n>0 )  // check condition
  {
    cout << n << ", ";  // execute body
    --n;
  }  // repeat

  cout << "liftoff! \n"
  return 0;
}
```
do-while loops
```c++
#include <iostream>
#include <string>
using namespace std;

int main()
{
  string str;
  do 
  {
    cout << "Enter text: ";  // execute body
    getline (cin, str);
    cout << "You entered: " << str << '\n';
  } while (str != "goodbye");  // check condition ; repeat

  return 0;
}
```
for loops
```c++
#include <iostream>
using namespace std;

int main()
{
//    [1]        [2]  [3]
  for(int n=10; n>0; n--)
  {
    cout << n << ", ";  // [4]
  }
// exe [1], check [2], exe [3]/[4], check [2], exe [3]/[4], ...

  cout << "liftoff!\n"
  return 0;
}
```