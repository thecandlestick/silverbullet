
# Python Strings

#Definition a **string** is an _immutable_ sequence of characters

**Operators:**
* ( [] ) - (read-only) access individual characters
  * indexing starts at position zero
* ( + ) - concatenation two strings
* ( * ) - repetition of a string
* ( == / != ) - equality / inequality
* ( < / > / <= / >= ) - less-than / greater-than
  * lexicographic comparison


## Slicing

#Syntax
```python
my_slice = my_string[start:end]
```
The above creates a _substring_ from variable _my_string_ including characters from index _start_ up to but not including _end_

**Special slices**

```python

my_string = "Go Miners!"

my_string[:3] # all the chars up to index 3
my_string[4:] # all the chars from 4 and beyond
my_string[:]
```

Negative numbers count from the back of the string

```python

my_string[-7:]
my_string[-7:-3]

```


## Methods

  **Searching/editing methods**

* str.**replace**(old, new) - replaces substring _old_ with substring _new_ 
* str.**replace**(old, new, count)
* str.**find**(ss) - returns the position of substring _ss_
* str.**find**(ss,start) - begins searching at index _start_
* str.**find**(ss,start,end) - stops searching before index _end_
* str.**rfind**(ss) - searches from the back of the string


  **Splitting/joining methods**
  
* str.**split**(delim) - splits a single string into a list of substrings for every occurrence of the _delim_ character
  * The default _deliminator_ is a space
    
* str.**join**(_aList_) - creates a string by connecting every string in _aList_ with _str_ in between
  * ( ‘‘ ) as _str_ will create a continuous string
  * ( ‘ ‘ ) will create a space-separated string
  * ( ‘, ‘ ) will create a “list-format” string


## f Strings

#Definition **_fstrings_** are short for “Formatted Strings.” They allow you to include variables in output and control what is displayed with one or more **fields** ( {} )

#Syntax
```python
print(f'{str:<fill character><alignment><field size>}')
```
In the print statement above:
  * **str** is a string variable
  * **field size** gives a fixed length that a string should take up
  * **fill character** is what to fill any extra space with (default ‘ ‘)
  * **alignment** is where to put _str_ in the field
    * (>) to right-justify
    * (<) to left-justify
    * (^) to center

