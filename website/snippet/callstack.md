The call-stack is used to manage the state of memory between function calls. It does so by organizing stack memory into **stack frames**, also known as **activation records**.

Each function call receives its own stack frame, and it contains information such as:

  * Arguments supplied to the function
  * Variables local to the scope of the function
  * A return address to where execution should resume afterwards

![the call stack](img/call-stack.png)