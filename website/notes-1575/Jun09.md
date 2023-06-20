

Date: 2023-06-09
Recording:  https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=caba2d6b-2e8a-486e-87a5-b01c0149c790 (cut short from internet issues 😿)

Reminders:
* [x] PA00 DUE TONIGHT
* [x] QUIZ 0 assigned

Objectives:
* [x] Finish Pointers

---



## 2D-Dynamic Array

<!-- #include [[examples/ptr-2d-array]] -->
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
<!-- /include -->

* [x] duc
* [x] ben n
* [x] ryan
* [x] makalyn
* [x] sarah

---

## The _this_ pointer

Every member function in C++ has a _hidden_ extra parameter added to it implicitly. It contains the memory address of the _calling object_, and can be accessed by its name, ```this```. It can be used whenever you need a function to refer to the object that called it.

```T* const this```

# Default Member Functions

Whenever a user-defined class is created, C++ automatically generates three special functions: a Destructor, an Operator= (assignment operator), and a copy-constructor.

* [x] matt
* [x] tony

<!-- #include [[examples/ptr-def-mem-func]] -->
```c++

// For a class “Foo” with members “x” “y” “z”

~Foo()
{
  // 🦗 ... nothing, the default destructor does nothing
}

const Foo& operator=( const Foo &rhs )
{

  if (this != &rhs) // alias check
  {
    x = rhs.x;  // direct copy of each member var
    y = rhs.y;
    z = rhs.z;
  }

  return (*this);  // return the calling object
}

Foo( const Foo &rhs ) : x (rhs.x), y (rhs.y), z (rhs.z)
{
  // Same as above  
}
```
<!-- /include -->

