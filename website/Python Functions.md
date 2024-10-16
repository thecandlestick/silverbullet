# Functions

_Programming_ functions are not the same as _mathematical_ functions

#Definition (function)
A named block of code. A **function call** can be used to invoke this block of code from elsewhere in your program

#Syntax
```python
def function_name():
  block
  of
  code
```

_Functions_ are useful for encapsulating repeated tasks. Using them to your advantage can simplify your code and make it ==easier to maintain==.

```python
def foo():
  print('  1  ') # 2
  print(' 1 1 ') # 3 
  print('1 2 1') # 4

# ...

print('Starting up...') # 1
foo()
print('Function complete!') # 5
```

A function can take in data by specifying **parameters**

#Syntax
```python
def function_name(parameter_1, parameter_2, ..., parameter_n):
  block
  using
  parameters

function_name('1', '2', ... , 'n')
```

#Definition Specific values passed into a _function call_ are called **arguments**. _Arguments_ become variables that are local to (exist within) the block of code. 

```python
def pretty_print(name):      # name: parameter
  print('*' * (len(name)+4))
  print('*',name,'*')
  print('*' * (len(name)+4))


pretty_print('Jack')         # 'Jack': argument
```

A function can optionally **return** a value. Doing so allows you to use functions as part of _expressions_.

#Syntax
```python
def function_name():
  return expr
  print('This will never be printed')
```

When a line beginning with _return_ is executed:
  * The function stops immediately
  * The function call is ==replaced with the return value==

```python
def F_to_C(fahrenheit):
  celsius = (float(fahrenheit) - 32)*(5/9)
  return str(celsius) # '18.33'

f_temp = input("Enter the temp in Fahrenheit: ")
# 65.0

print('The temp in Celsius is ' + F_to_C(f_temp) + ' Today')
# print('The temp in Celsius is ' + '18.33' + ' Today')
```

Why use functions?

* Organize your code
* Re-use your code

#CodeTogether

A room has a number of picture frames with
* outer-width: ow
* outer-length: ol
* inner-width: iw
* inner-length: il

Calculate the amount of wall space covered by the picture frames (not the pictures inside)

```python
def area_of_frame(ow,ol,iw,il):
  area_of_outter = ow * ol
  area_of _picture = iw * il

  area = area_of_outter - area_of_picture
  return area

picture_frames = [(5,5,2,2),(10,12,7,7),(6,8,2,4)]

total = 0
for pf in picture_frames:
  total += area_of_frame(pf[0], pf[1], pf[2], pf[3])


```

---

## Nested Functions

Functions can call other functions from inside their _body_ (block of code)

```python
from math import pi

def area_circle( radius ):
  area = math.pi * radius * radius
  return area

def vol_cylinder(height, radius):
  volume = height * area_circle( radius )
  return volume

def vol_cone(height, radius):
  volume = vol_cylinder(height, radius) / 3
  return volume
```

---

## Variable Scope

#Definition The **scope** of a variable is the range of statements over which the variable is visible (can be used).

**global** variables are available throughout the entire program

**local** variables are available only in the function/loop/conditional block in which they are created

  These _local_ variables “mask” (take precedence over) _global_ variables of the same name

```python
name = 'Jack'

def greet():
  name = input('What is your name? ')
  print('Hello,', name)

greet() # which name will be printed?
print(name) # and here?
```

The keyword _global_ can be used to refer to (and modify) global variables from inside an indented block

#Syntax
```python
name = 'Joe'

def modify_global():
  global name
  name = 'Joe Miner'

modify_global()
print(name) # output: Joe Miner
```

Some parameters are treated as local variables, but others are not

```python
def combine(a, b):
  a += b
  b = a
  print('A:', a ,'B:', b)

alpha = 2
beta = 3

combine(alpha, beta)

print('Alpha:', alpha,'Beta:', beta)
```


```python
def append_list(aList, listVal):
  aList.append(listVal)
  print(myList)
  
myList = ['a', 'b', 'c']
myListVal = 'z'

append_list(myList, myListVal)

print(myList)
```


_Immutable_ parameters are copied into local variables (“pass-by-value”)
  * Int
  * Float
  * String
  * Tuple

_Mutable_ parameters refer to the global variable (“pass-by-reference”)
  * List
  * Dictionary
  * Set


**Warning:** Python does not check whether arguments are compatible with a function

```python
myString = 'abc'
append_list(myString, 'z') # Error: strings can't append
```

These errors only appear after the code has already tried to run and crashed. This is because Python is **weakly typed** (or **dynamically typed**). **Strongly typed** languages can catch these problems before running

_Note:_ Python does support **type-hinting** to replicate the benefits of a strongly-typed language

* https://docs.python.org/3/library/typing.html
* https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html


## Documenting Functions

It’s standard practice to use comments to document what your code is doing and why. This is especially important for functions

```python
def combine(a, b):
  """
  This function combines the values of two variables
  Arguments:
    - a: any valid type
    - b: same type as a
  Return:
    - None
  Preconditions: 
    - a, b should be compatible for + and =
  Postconditions:
    - a and b will be modified based on their values
    - the combined values will be printed after assignment
  """
  a += b
  b = a
  print('A:', a ,'B:', b)
  
```

It’s typical to include information on:

- **Purpose** of the function
- **Return** value of the function
- **Arguments** passed to the function
- **Preconditions**, or what assumptions are needed for the function to work properly
- **Postconditions**, or what effects and changes the function will produce
