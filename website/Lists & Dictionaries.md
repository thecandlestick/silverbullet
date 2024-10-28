
All programs work with some amount of _data_ (variables, input, files, etc.) 

When you have a collection of related data, you need to organize it with a _data structure_ 

# Python Lists

A list is a _sequence_ of elements
* The size of a list is not fixed
* Elements can be different types
* Lists can be nested

A list is _mutable_
* Elements of a list can be modified
* The ( = ) operator does not “copy” but instead creates an “alias”
* Passed “by reference” when used as argument to function

**Operators**

* list(_container_) - constructor
* list[i] - indexing
* item **in** list - search (true/false)
* _aList_ + _bList_ - concatenation

Lists can also be _sliced_ just as strings can!
#Syntax (List Slicing)
```python
subSequence = aList[start:end]
```


**Methods**
* append()
* extend()
* insert()
* remove()
* pop()
* reverse()
* sort()
* index()
* count()