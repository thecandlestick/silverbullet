while loops
```c++
#include <iostream>
using namespace std;

int main()
{
  int n = 10;

  while( n>0 )
  {
    cout << n << ", ";
    --n;
  }

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
    cout << "Enter text: ";
    getline (cin, str);
    cout << "You entered: " << str << '\n';
  } while (str != "goodbye");

  return 0;
}
```
for loops
```c++
#include <iostream>
using namespace std;

int main()
{
  for(int n=10; n>0; n--)
  {
    cout << n << ", ";
  }
  cout << "liftoff!\n"

  return 0;
}
```