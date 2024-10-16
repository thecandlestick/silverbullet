
# Loops/Iteration/Conditional Repetition

#Definition (Conditional Repetition) continue repeating a block of code while some condition is _True_

## While Loops

#Syntax (While loop)
```python
while boolean_expression:  # loop condition
  block # repeat block while condition is true
  of
  code
```

_example:_ (counting loop)
```python
n = int(input('Please enter a number: '))

while n >= 0:
  print(n)
  n = n-1
  
print('Done!')
```

**Warning:** If the expression never becomes _False_, then your program becomes trapped in an infinite loop! (press Ctrl+c to escape)

As a rule, your block of code should modify some variable in order to eventually falsify the loop condition

_example:_ (User-controlled loop)

**Idea:** base the loop condition on some user input
```python
name = input('What is your name? ')
while name != 'Goodbye': # name is a "control variable"
  print('Hello', name + '!')
  name = input('What is your name? ')

print("Goodbye")
```

```
do
  name = input('What is your name? ')
  print('Hello', name + '!')
while name != 'Goodbye'
```


---

_Recall:_ **Euclid’s Algorithm** for finding GCF

#CodeTogether
What are the steps for the algorithm? What is the loop condition?
* read in two numbers (a & b) as input
* loop while (_a != b_)
  * comparing a and b
  * if a is larger:
    * subtract b from a
  * else:
    * subtract a from b 

```python
a = int(input('Enter a: '))
b = int(input('Enter b: '))

while a != b:
  if a > b:
    a = a - b
  else:
    b = b - a

print('Greatest common factor is:', a)
```


_example:_ (the Collatz Conjecture)

* Given a positive integer n:
* REPEAT while n != 1:
  * if n is even, n becomes n/2
  * if n is odd, n becomes 3n+1

```python
n = int(input('Enter a positive integer: '))

print(n)
while(n != 1):
  if n % 2 == 0:
    n = n/2
  elif n % 2 == 1:
    n = (3*n)+1
  print(n)  
```

#DiscussionQuestion Notice that the control variable _n_ can go up or down as the loop goes on. Can this result in an infinite loop? 

---
## For Loops

_Common looping use-case:_ do something with every element of a collection

The for-loop is a convenient way to do exactly that.

#Syntax (for-loop)
```python 
for var_name in collection:
  block
  using
  var_name
```
The indented block will execute once for every item in _collection_. The variable _var_name_ will take on a new value from _collection_ each time

_Collection_ can be any of the container types we’ve seen
* List
* Tuple
* String
* Set
* Dictionary

```python
the_hexapods = ['john', 'paul', 'ringo', 'george']
for h in the_hexapods:
  print(h) # print every element from x

search_char = input('Enter a letter')
string_var = 'the quick brown fox jumped over the lazy dog'
for c in string_var:
  if c == search_char # find a character in a string
    print('success!')

aDictionary = {'john':90, 'bill':80, 'alice':95}
for key in aDictionary:
  print(key) # printing available keys from dictionary
```

---

## Generators

#Definition A _generator_ in Python is a special “function” (object) intended to generate a collection of items following a pattern. Items are generated only as needed and not all-at-once.

Another common scenario to use ==for-loops is to specify a fixed number of repetitions.== This can be achieved using the _range_ function which returns a generator

### range

#Syntax (range)
```python
a = range(10) # a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
b = range(4,8) # b = [4, 5, 6, 7]
c = range(5, 15, 3) # c = [5, 8, 11, 14]
```

* **range(_stop_)** - generates list from 0 to _stop_-1
* **range(_start,stop_)** - generates list from _start_ to _stop-1_
* **range(_start,stop,step_)** - generates list beginning at _start_, adding _step_ each time, and ending before _stop_

_example:_
How many even numbers between 0 and 10,000 are divisible by 7 and 11?

```python
counter = 0
for i in range(0, 10002, 2): # [0, 2, 4, 6, ..., 10_000]
  if i%7 == 0 and i%11 == 0:
    counter += 1
print(counter)
```

### enumerate

#Syntax (enumerate)
```python
enumerate(['a','b','c']) # [(0,'a'),(1,'b'),(2,'c')]
```
The _enumerate_ function takes a list and generates pairs of each element with its index.

### zip

The _zip_ function takes two lists (_list1, list2_) and generates a list of pairs where the first element is from _list1_ and the second is from _list2_

---

### Nested Loops

Loops can be nested just like container types and conditional branching.

```python
cat = ['chunky', 'hunky', 'chonky']
dogs = ['laika', 'lassie', 'marly']

# Dogs vs. Cats pet show tournament
for c in cats:
  for d in dogs:
    print(c, 'vs', d) # how many times will this line execute?

```

## Which Loop to use

_while_ loops are useful when it is ==not known beforehand== how many times the code should repeat. 

  **example:** finding a value in a collection

_for_ loops are best used when you know ==exactly how many times the code should be repeated.==

  **example:** summing the elements of a collection


## More Loop Examples

  **_General coding advice_**:

For any coding challenge, the first thing you should do is _carefully_ read and understand the instructions. The specifications are specific!

  - Don’t move on if the instructions are confusing! Look at any provided examples or notes, or ask your instructor for clarification

The second step is to consider how you would solve the problem _yourself_ (manually, without concern for how long it would take).

  * Try writing down your solution in English, you’re much more likely to spot a problem with the logic that way
  * Practice your method on a small example to verify it works
  * Always brainstorm “edge cases” that could stump your solution
  
The third step is then to describe the process to the computer in the language of python

  * Do not wait until the program is finished to test it! You’ll save time by testing each step of your solution as you write it

**Problem:** _Count how many vowels in a string_

**Problem:** _Given integer n, generate a list of n random integers in the range of 0 to 1,000_

**Problem:** _Given a list of 10 <= n <= 100 random integers in the range 0 to 1,000, find and print the largest number in the list that is divisible by 7. If no such number exists, print ‘no multiples of 7’_

