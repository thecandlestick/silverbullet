

Date: 2023-06-08
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=26969397-a120-4c06-9dd4-b01b013b59af

Reminders:
* [x] PA00

Objectives:
* [x] Continuing our discussion of pointers
* [x] Learn about dynamic memory

---

* [ ] sarah
* [ ] tony
* [ ] matt
* [ ] sarah
* [ ] ryan
* [ ] sarah
* [ ] makalyn

# Dynamic Memory

Standard variables are created at _compile time_, but it is also possible to create variables on-demand during _run time_.

Variables created during run time have no name by which to refer to them. Instead, pointers are used to track and manage these _dynamic_ variables.

Standard variables exist in a part of memory known as the **stack**. Dynamic variables exist in a different part of memory known as the **heap.**

## _new_ Operator

(Dynamically) Allocates a new variable or array of variables and returns a pointer to it

```my_pointer = new <type>``` used for dynamic variables

```my_pointer = new <type>[<size>]``` for dynamic arrays

## _delete_ Operator

Unlike standard variables that get removed when leaving their scope, dynamic variables can persist until the program completes. It is therefore the _programmer’s_ responsibility to clean up after themselves. the _delete_ operator must be used to de-allocate a dynamic variable.

```delete <ptr>;```  used for dynamic variables

```delete [] <ptr>;```  used for dynamic arrays

* [ ] garret w

Please note: _delete_ **DOES NOT** alter the pointer in any way. It **ONLY** de-allocates the memory used by the object being _pointed to_.

<!-- #include [[examples/ptr-new-delete]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int x, y;
  int *p = new int;
  cin >> x;
  int *q = new int[x];
  Fish *f = new Fish;

  delete p;     // p = nullptr;
  delete [] q;  // q = nullptr;
  delete f;     // f = nullptr;

  return 0;
}
<!-- /include -->

## Problems with Pointers

**Dangling Pointers** are pointers that are used with invalid addresses
<!-- #include [[examples/ptr-dangling]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int *p;
  // *p = 5;  Where is *p?

  p = new int[3];

  // p[10] = 7;      Invalid Write
  // int x = p[10];  Invalid Read
  delete [] p;
  // p[3] = 8;  Dangling Pointer!

  return 0;
}
<!-- /include -->

Valgrind
* [ ] ben n
* [ ] dheeraj

**Memory Leaks** occur when dynamic memory becomes unreachable
<!-- #include [[examples/ptr-mem-leak]] -->
```c++
#include <iostream>
using namespace std;

int main()
{
  int *p;

  for( int r=0; r < 10; r++ )
    p = new int[10];  // AAAA! Memory Leak!

  return 0;
}
<!-- /include -->

These problems create very nasty bugs, because they often do not crash your program. They allow it to go on until something else breaks as a result!

Some good rules-of-thumb to avoid pointer problems:
* every call to ```new``` should have a corresponding call to ```delete```
* pointers should be initialized to a value or ```nullptr```
* after de-allocating a pointer, it should be set to ```nullptr```

Other issues to watch out for include **double-free** errors (deleting a pointer twice) and **shallow copies** (copying a memory address when you intended to copy the object pointed to).

* [ ] dheeraj (stdio_error)
* [ ] ryan (grade.sh build error)