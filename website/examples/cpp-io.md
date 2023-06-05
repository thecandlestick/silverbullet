```c++
#include <iostream>
using namespace std;

int main() 
{
  int i;
  cout << "Please enter an integer value: ";
  cin >> i;
  cout << "The value you entered is " << i;
  cout << "and double is " << i*2 << endl;

  return 0;
}
```

```c++
#include <iostream>
#include <string>
using namespace std;

int main()
{
  char initials[2];
  string mystr;

  cout << "What are your initials? ";
  cin.get(initials,2);  //read arbitrary # of characters
  cout << "Hello " << intials << endl;

  cout<< "What is your favorite food?";
  getline(cin, mystr);  //read one "line" of input
  cout << "You like " << mystr << endl;

  return 0;
}
```