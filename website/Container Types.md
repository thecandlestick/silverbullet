

## Review

The _random_ module - random numbers and choices for your program

* random() - random real value [0,1)
* randrange(a,b) - random real value [a,b)
* randrange(b) - random real value [0,b)
* randint(a,b) - random integer [a,b]

```python
import random # import the entire module
from random import randint # import only the randint function

zero_to_one = random.random()
four_to_eight = randint(4,8) # notice no "random." necessary here
```

### On _Pseudo_-random numbers

_random_ numbers in Python are not _really_ random. They actually follow a consistent formula based on the initial **seed** value.

By default, the seed comes from the current time. This is what makes the random numbers _appear_ random. The seed can also be manually set using the _seed()_ function

```python
import random
random.seed(42) # this program will always generate the same numbers

roll_a_dice = random.randint(1,6)
print(roll_a_dice)
roll_a_dice = random.randint(1,6)
print(roll_a_dice)
roll_a_dice = random.randint(1,6)
print(roll_a_dice)
roll_a_dice = random.randint(1,6)
print(roll_a_dice)
roll_a_dice = random.randint(1,6)
print(roll_a_dice)
```

ex. Marsenne Twister

# Container Types

Python includes many types that serve as _containers_ for multiple individual pieces of data. 

### Strings

A string is used for text representation.
```python
"banana"
favorite_fruit = "orange"
```

In memory, strings are a sequence of **characters** which are represented by integers according to the **ASCII** table (or the greatly extended **unicode** table)

The **ord(_char_)** function takes as argument a _character_ and returns its _integer_ equivalent

The **chr(_int_)** function takes as argument an _integer_ and returns its _character_ equivalent

```python

what_is_e = ord(e)
back_to_char = chr(what_is_e)

```

**Escape sequences** are used to represent _non-character_ values in strings or access characters with special meanings

* \t - tab
* \n - newline
* \‘ - single quote (the character)
* \“ - double quote (the character)
* \\ - backslash (the character)

Strings in Python also come with several _operators_

* (+) - concatenate strings
* (*) - repeat a string
* ([]) - indexing

**Indexing** allows you to refer to individual characters. The position of characters begins at zero. Python also allows indexing _from the back_ using negative position values

```python
long_string = "the quick brown fox jumps over the lazy dog"
first_character = long_string[0]
last_character = long_string[-1]
```

Strings in python are **immutable** (cannot change once created)

## Lists

#Definition a **list** is a sequence of data elements. Data elements can be any valid Python value, and the types do not have to match

```python
fruits = ['banana', 'orange', 'mango', 'strawberry']
mixed_list = [2,3,'hello', 25.8, [1,2,3], 0]
empty_list = []
```

**Operators:**

* len(_list_) - returns the length of a list
*  (+) - concatenates two lists
*  (=) - assignment

```python
citrus_fruits = ['lemon', 'orange', 'lime', 'yuzu']
berries = ['blueberry', 'strawberry', 'banana']

fruits = citrus_fruits + berries
print(len(fruits))
```

_Note:_ assignments for lists do not “create a copy” as it does for single variables. An assignment will instead add an extra reference to the same list in memory

### Indexing

lists can be _indexed_ using the ([]) operator, in a similar way to strings.

#Syntax
```python
[my_listi]
```
where i is an integer, will return the i-th element of my_list

* As with strings, positions in the list start at zero
* Unlike strings, lists can be modified using indexing

```python
the_arthropods = ['john', 'george', 'ringo', 'paul']

the_bug_boys = the_arthropods
the_bug_boys[2] = 'a real beetle'
print(the_arthropods[2]) # output: 'a real beetle'
```

**Useful functions**

* **min(_list_) / max(_list_)** - returns the minimum or maximum value out of the list items. Items must be the same type to apply
* **sum(_list_)** - returns the sum of all list items. Items must be numerical to apply

**Useful methods**

#Definition A _method_ is a function that must be attached to an object in memory. This object is called the _calling object_, and methods are designed to act on that object in some way

* aList.count(_val_) - returns number of occurrences of _val_ in _aList_
* aList.append(_val_) - adds _val_ at the end of _aList_
* aList.pop() - removes the item at the end of _aList_
* aList.remove(_val_) - removes the first occurrence of _val_ in _aList_
* aList.clear() - clears all elements of the list

```python
bin_list = [0,0,1,1,0,1,1,1,0,1,1,0,0,0,0,1,0,0,0,1,1]

zeros = bin_list.count(0)
bin_list.append(2)
bin_list.pop()
bin_list.remove(1)
bin_list.clear()
```

Lists can also be _unpacked_ into multiple variables. This is done by making an assignment with multiple variables on the left-hand-side

```python
RGB = [123, 56, 90]
red, green, blue = RGB
```

## Tuples

#Definition A _tuple_ is an _immutable_ sequence of items. They can be thought of as a list that cannot be changed once created.

```python
my_tuple = ('item1', 'item2', 3, 4.0)

my_var = my_tuple[1]
my_tuple[1] = '2' #ERROR! Tuples are immutable
```

**Operators:**

* **([])** - indexing (read-only)
* **len(aTuple)** - length of _aTuple_
* var1, var2 = len_2_tuple (**_unpacking_**)

## Sets

#Definition A _set_ is an _unordered_ collection of _unique_ items.

```python
games = {'chess', 'checkers', 'backgammon', 'battleship'}
empty_set = set()
```

**Operators:**

* aSet.add(_val_) - adds _val_ to _aSet_
* aSet.remove(_val_) - removes _val_ from _aSet_
* aSet.pop() - removes a random element from _aSet_
* aSet.clear() - removes all elements from _aSet_
  
* aSet.intersection(_bSet_) - returns set with elements in both _aSet_ AND _bSet_ 
* aSet.union(_bSet_) - returns set with elements in either _aSet_ OR _bSet_ 
* aSet.difference(_bSet_) - returns set with elements in _aSet_ BUT NOT _bSet_

## Dictionaries (maps, hash-tables, hash-maps)

#Definition A **dictionary** is an unordered collection of key & value pairs, where the keys are all unique

_key idea:_ dictionaries are very easy to retrieve specific data from (for Python). In exchange, they have to be searched “by key” they can’t be searched “by index” or “by value”

_values_ are the actual data being stored, but we search for them based on their corresponding _key_

```python
my_first_dictionary = {'key1':'val1', 'key2':'val2', 'key3':'val3'}

# key: student ID, val: course grade
student_grades = {12947654:79.5, 18908230:87.1, 12550681:99.9, 12430967:79.5}
```

**Operators:**

* aDict[aKey] - access or modify value for _aKey_. Can also create new key/value pairs if _aKey_ does not already exist
* aDict.pop(aKey) - remove pair with key _aKey_


_note:_ _Keys_ can be different types in the same dictionary, but must be immutable. There are no restrictions for _values_

**Immutable types:**
* Integers
* Floats
* Strings
* Tuples


# Nested Types

Container types can be used to store other container types! When using nested containers, it’s often necessary to use the bracket ([]) operator multiple times on a single line

```python
#
# Members of a Dungeon Party
#
[
  {
  'name': 'greg',
  'hp' : 87,
  'mp' : 0} ,
  {
  'name': 'bob',
  'hp' : 6,
  'mp' : 25,
  'spells' : ['fireball','cure wounds']},
  {
  'name': 'abbey',
  'hp' : 52,
  'mp' : 0,
  'sneak-step' : True}
]
```

## Constructors

#Definition a _constructor_ is a special function that is used to create a particular type of object

* int(_value_) - can accept integers, strings, or floats for _value_
* float(_value_)
* str(_value_) - creates a string representation of _value_
* list(_container_) - creates list with items from _container_
* tuple(_container_)
* set(_container_) - creates set from _container_ (duplicates discarded)
* dict(_container_) - elements of _container_ must be pairs (key, value)

The parameters to these constructors are optional, a default value or empty container will be created if you don’t supply an argument.