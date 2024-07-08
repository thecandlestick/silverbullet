## The hidden cost of a function

Even if a recursive and iterative version of an algorithm have the same _analytical_ time-complexity, you may often find that the iterative version outperforms _empirically._ This is because of another consideration for recursive algorithms which is the cost of maintaining the _call stack_.

Remember that every time we make a function call, a _stack frame_ is generated with information about the current state of the program before the new function takes control. This takes a non-trivial amount of time to do, but we disregard it during analytical testing as it is technically environment-dependent and does not have an effect on rate-of-growth.

What this tells us is that while recursive algorithms are good enough for most purposes and can offer significantly increased readability/maintainability, if speed is your primary concern you may look for an iterative equivalent.
