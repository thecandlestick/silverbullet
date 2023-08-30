
This is a quick tutorial to get you started with the debugger.
[click here](pdf%2FDebuggingwithGDB.pdf) for an awesome, in-depth tutorial on debuggers!

# What’s a debugger?

It’s for situations where you and your rubber duck both agree the code should work, but it doesn’t.

Simply put, it’s a tool that makes understanding and fixing your code _easier_. Given that the lion’s share of all coding is spent tracking down and stomping out issues 🐞🔨, learning to use a debugger is perhaps the most essential and marketable skill that you can develop in an afternoon. The debugger we will use is the GNU-DeBugger (GDB), but nearly every debugger operates pretty much the same.


# But what’s wrong with Ol-Reliable? (cout 🤡) 

Nothing, really. Using a debugger instead is just usually the quickest and easiest route to bug-free code, with a little practice. People tend to resist picking up the debugger because when you’re currently faced with the stress of a rapidly approaching deadline or brain-melting bug, the prospect of learning to use one understandably seems like yet another task you don’t have time for.

If you’re in that situation now, then allow me to convince you to read on. If your code is crashing, it’d be useful to know when exactly that happens in the course of your program. You might be tempted to pepper your code with some ```cout``` statements at various places to narrow down how far it gets.

Why waste time guessing when a debugger can answer that for you?
If you only know one gdb command, make it ```backtrace```. Observe:

![compiling debug version](img%2Fdebug-version.png)
![reading debugger](img%2Fdebugger-output.png)

Here I
* Compile a debug-version of my program (g++ -g mycode.cpp)
* Enter the debugger (gdb ./a.out)
* Run the program (run)

When it crashes, I uncross my hopeful fingers and type ```backtrace```. The debugger then informs me not only the **exact line of code where the crash happened**, but also the steps the program took to arrive there (the _call stack_). In this specific case, a little extra digging leads me to find that I’ve de-referenced a nullptr, an easy fix! That extra context is the cherry-on-top which makes a fix even easier, and this is just one single use for a debugger!

# The essential commands

```start / run``` : begin debugging from the first line / run until a stopping point is reached

```next / step``` : advance one line from a stop / advance into a function on the current line

```break / continue``` : set a stopping point / continue running from a stop

```info locals / info args``` : display the values of local variables / function arguments

```backtrace``` : display the call stack

Other useful commands for the experienced debugger include:
* ```list```
* ```print```
* ```set var```

### Help! It’s not working and I can’t get out!

Don’t panic, we’re gonna get you out of there. Once you run the debugger, you only have access to gdb commands. To retreat to the safety of your terminal, simply type ```quit``` (then take a deep breath, get back in there, and try again!).

_Here are a few reasons why it might not be working:_
* You may have made the mistake of trying to debug your _code file_ (.cpp) instead of your _compiled program_ (a.out)
* Your program may simply be waiting for input. You can debug your program with an input file like so: ```start < input.txt```

### Help! I have no idea what it’s saying!

_Debugger fails you_
_I know what you are missing_
_Debugging symbols_

You may simply forgotten to compile a _debug-version_ of your program   (```g++ -g mycode.cpp```). If you neglect this step, you will be faced with an unreadable mess of memory addresses and very little useful information. If you’re still at a loss, you may just need more practice picking out the relevant parts of what GDB shows you. Check out the [full tutorial](pdf%2FDebuggingwithGDB.pdf) for help with interpreting output.

### Help! It’s showing me code I didn’t write!

GDB is giving you a glimpse of the 🔮 arcane inner-workings of C++ 🔮. Turn-back now, it’s too much for mortal eyes! Put simply, what you’re seeing is lower-level instructions or library code that your program relies on. 

_To avoid this:_
* Make careful use of ```step```, use it only if you want to go deeper into the details of your program. Most likely, you ```step```‘ed when you should have ```next```‘ed
* Consider setting a _breakpoint_ at the part of your code you’re interested in to avoid getting lost

### Help! My code actually works! (In the debugger only)

If you find yourself in this situation (or vice versa), you may feel as though peace is no longer an option and your computer must die 🙂

When this happens, the explanation is almost always _memory bugs_. If the cause of your woes is that you are mishandling memory through invalid read/write operations, then this can happen because memory is treated differently when running through the debugger. You will at this point want to use a tool such as [[Valgrind]] to find the root of the problem.