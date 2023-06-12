```c++
#include <iostream>
#include <string>
using namespace std;

class Tiger
{
  string name;
  int *q;
};

class Fish
{
  private:
    int x;
    float s;
  public:
    void swim() { cout << "just keep swimming ... "; }
};

int main()
{
  Fish Nemo;
  Fish* p = &Nemo;
  
  // *p.x = 3;  INVALID! p has no member x
  (*p).x = 3;   // Valid, access member x of *p
  p -> s = 1.61;  // Valid, access member s of *p
  p -> swim();

  return 0;
}
```