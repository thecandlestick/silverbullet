```c++
#include <iostream>
using namespace std;

class IntBox  // example class with dynamic member variable
{
  int *item;
  public:
    IntBox(int i){ item = new int(i); }  // constructor
    void set(int x) { *item = x; }       // mutator
    void print() { cout << *item; }      
    const IntBox& operator=( const IntBox &rhs );
};

int main()
{
  IntBox b1(4);
  IntBox b2(200);

  b1 = b2; // operator= called here
  
  b1.set(5);
  b1.print();
  b2.print();

  return 0;
}

// "proper" assignment operator
const IntBox& IntBox::operator=( const IntBox &rhs )
{
  if (this != &rhs)
  {
    *item = *rhs.item;  // "deep copy" of pointer members
    return (*this);  // return the calling object
  }
}
```