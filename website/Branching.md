
#Definition _Branching_ allows you to control the execution of your program. Which sections of your code get executed depends on some condition.

# Boolean Expressions

#Definition a _Boolean_ is a logical object that can represent the concepts _True_ or _False_

**Operators:**
* (==) - is equal to
* (!=) - is not equal to
* (>) - is greater than
* (<) - is less than
* (>=) - is greater than or equal to
* (<=) - is less than or equal to
* or
* and
* not

#Definition a _boolean expression_ is an expression that evaluates to a boolean value (True or False)

A program can make decisions on what to do next based on any boolean expression that you define.

---
## Conditional Statements

#Syntax (_if_ statement)
```python
# code, code, code
if boolean_expression:
  block
  of
  code
# code, code, code
```
The _block of code_ above only executes if _boolean_expression_ evaluates to _True_. It is skipped over if _boolean_expression_ evaluates to _False_

#Definition A _block of code_ in Python is a sequence of statements that begins with increased indentation and ends with decreased indentation. Blocks can contain other blocks.

**note:** in Python, indentation must be consistent. You can use tabs or spaces, but cannot mix them in a single program


#CodeTogether
* Lemonade is being sold for $1.25 a glass
* 10% discount applied if you buy 5 or more
* Write a program to compute the total cost for an order
```python
# Set the price of lemonade
price_per_glass = 1.25 # price in USD

# Take order from customer
quantity = int(input('How many glasses do you want: '))

# Compute total cost without discount
total_cost = price_per_glass * quantity

# Apply discount only if buying 5 or more
if quantity >= 5:
  discount = total_cost * .1
  total_cost = total_cost - discount
  
# Display final cost
print(f'Your total is: {total_cost:.2f}')
```

#Syntax (_if-else_ statement)
```python
# code, code, code
if boolean_expression:
  block1
else:
  block2
```
_block1_ (and not _block2_) is executed if _boolean_expression_ evaluates to _True_. _block2_ (and not _block1_) is executed if _boolean_expression_ evaluates to _False_

```python
# Check if an integer is even

n = int(input('Enter an even integer: '))

# a number is even if the remainder when dividing by 2 is 0
if n % 2 == 0:
  print(n, 'is even')
else:
  print(n, 'is odd, not even!')
```

#Syntax (_if-elif_ statement)
```python
if boolean_expr1:
  block1
elif boolean_expr2:
  block2
elif boolean_expr3:
  block3
else:
  else_block
# code, code, code
```
Each boolean expression is tested sequentially. The first one which evaluates to _True_ will have the corresponding block executed. The else block is optional

_Example:_ Thermometer

* Given a numeric input, describe the temperature
* 59 F and below is “frozen”
* 60-69 F is “cool”
* 70-79 F is “nice”
* 80-89 F is “hot”
* 90 F and above is “toasty”

```python
temp = int(input('Enter Temperature '))

if temp < 60 :
  print('frozen')
elif temp < 70 : # no need to check if temp >= 60 (why?)
  print('cool')
elif temp < 80 :
  print('nice')
elif temp < 90 :
  print('hot')
else : # no condition needed at all (why?)
  print('toasty!')
```

---

## More Boolean Operators

* _item_ **in** _container_ - _True_ if _item_ is somewhere in _container_
  * _item_ **not in** _container_ - _False_ if _item_ is somewhere in _container_

```python
'a' in 'skdlforeadkjnfwoe'
numList = [1,2,3,9,4,5]
7 in numList
```

  * This operation is more expensive (takes longer) for sequential types (String, List, Tuple, etc), especially if the sequence is long.

  * When applied to a dictionary, it checks if _item_ is a Key


* _x_ **is** _y_ - _True_ if both _x_ and _y_ ==refer to the same place in memory==
  * _x_ **is not** _y_ - _False_ if both _x_ and _y_ refer to the same place in memory

```python
a = [1,2,3]
b = a

a is b # True!

c = list(a)

a is c # False
a is not c # True
```

## The Conditional Expression

#Syntax (conditional expression)
```python
expression_1 if boolean_expression else expression_2
```
Evaluates to _expression_1_ if _boolean_expression_ is _True_. Otherwise, evaluates to _expression_2_

```python
# A common way of modifying variables
if x < y:
  x = x + 1
else:
  x = x - 1

# An alternative method
x = x + 1 if x < y else x - 1

```

# Nested Conditionals

Branching statements can be nested

_Common Interview Question:_ **FizzBuzz**
```python
# Given a positive integer n:
  # print "Fizz" if n is divisible by 3
  # print "Buzz" if n is divisible by 5
  # print "FizzBuzz" if n is divisible by both 3 & 5
  # otherwise, print n

n = int(input('Enter the value for n: '))

if n % 3 == 0:
  if n % 5 == 0:
    print('FizzBuzz')
  else:
    print('Fizz')
elif n % 5 == 0:
  print('Buzz')
else:
  print(n)
```

