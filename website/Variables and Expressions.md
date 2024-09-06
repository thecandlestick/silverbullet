Rules for variable names:

1. Consist of letters, numbers, and ‘_’
2. Cannot begin with a number
3. Names are case-sensitive
4. Cannot be a _keyword_ (reserved terms for Python syntax)

Ex. of keywords:

* if
* True
* False
* class
* for
* while


### A point about _functions_

int(), print() and input() are _functions_

#Definition A **function** is a named piece of code that accepts **parameters** (inputs) and optionally returns a value.

_parameters_ -> **_function_** -> _return value_

* **print(_expression_)** - outputs the result of _expression_
* **input(*_prompt_)** - reads from keyboard and returns result. *outputs prompt for user
* **int(_expression_)** - returns _expression_ converted into an integer, if possible

A function can be used inside an expression. In that case, the return value from the function will replace the _function call_ when evaluating the expression.

## More arithmetic operators

Recall _operators_: + - * / //

Exponentiation: _a_ ** _b_

“Apply and assign” operators: combine assignment with other operators
* +=
* -=
* /=
* *=

Ex.
```python
x = 4

x += 2
x = x + 2

x -= 2
x = x - 2

x /= 2
x = x/2
```

## Boolean Expressions

#Definition **Boolean expressions** evaluate to a _logical_ value

Special values: **True** and **False**

These are the “Logical Literals”

Operators:

```python
"""
 < - less than ; a < b
 > - greater than
 <= - less than or equal to
 >= - greater than or equal to
 == - is equal to
 != - is not equal to
 or - logical or
 and  - logical and
 not - logical not
"""
```


## Basics of Modules

_Key idea:_ Split a large program across multiple files. Make your code more _modular_

The **import** keyword tells Python to include one code file in another code file

Python has a large _Standard Library_ of helpful _modules_ that you can use in your programs

The **math** module includes many mathematical functions
* sin()
* cos()
* tan()
* acos()
* asin()
* atan()
* radians()
* degrees()
* sqrt()
* log()
* pow()
* factorial()

The **random** module allows you to generate _randomness_ for your program

* random()
* randint()
* choice()

```python
import math
import random as rand

root = math.sqrt(169)
random_number = rand.random() % random real value 0 to 1
```

