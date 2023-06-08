
# Exception Handling in C++

As computer scientists, we study and admire elegant and iron-clad algorithms that can be trusted to predictably arrive at the desired result. In reality, code is never so air-tight. There will always be **exceptions**, some foreseeable and others... unexpected.

The best that we can do is anticipate when and where something might go wrong, and fortify our program with exception-handling code.


## Keywords

There are 3 C++ keywords that are used in exception handling.

* **try** - defines a code block that _could_ fail
* **throw** - used to signal a failure
* **catch** - defines a code block to handle an error

[[examples/except-basics]]

It is also possible to have multiple throw/catch statements for handling different exceptions in different ways.

[[examples/except-mult-try-catch]]

catch-all

std library exceptions