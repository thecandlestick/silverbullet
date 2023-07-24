

Date: 2023-07-21
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=e270e051-4a22-4219-9aae-b0460155cda8

Reminders:
* [x] PA05 due sunday
* [x] Quiz 6 is released (heaps)

Objectives:
* [x] introduce HashMaps

---


# The Map Abstract Data Type

A Map is an _unordered collection(set)_ of pairs. Each pair consists of a **key** and a **value**. 

{ <key1, val1>, <key2, val2>, ... , <keyn, valn> }

Keys in a Map must be _unique_ so that no two pairs have the same _key_, but there is no such restriction on _values_.

## Operations

- getValue(M, key) -> the value paired with _key_, if _key_ is in M
- setValue(M, key, value) -> M’ with updated pair _<key, value>_
- insert(M, key, value) ->  M’ with new pair _<key, value>_
- erase(M, key) -> M’ without pair identified by _key_
- find(M, key) -> true if _key_ in M, false otherwise


The motivation behind the Map is that unlike the List we do not need to maintain the order of the data. This allows us to strategically structure the data to optimize our operations as much as possible. This ADT also commonly goes by the name of _Dictionary_

---


# Map Data Structures

## C++ standard library implementations:
* [std::map](https://en.cppreference.com/w/cpp/container/map)
* [std::unordered_map](https://en.cppreference.com/w/cpp/container/unordered_map)

## Our Implementations:

[[TreeMap]] - Memory-efficient implementation based on [[BST]]

[[HashMap]] - Time-efficient implementation based on associative arrays


We’ve seen how to implement a map that runs in logarithmic-time as a [[TreeMap]]. This already scales extremely well, but can we do even better?

The _Hash Map_ (or _Hash Table_) is one of the most widely used data structures in existence, as it offers the unique ability to perform constant-time lookup of the data. This means that regardless of the size of your collection, a _find_ operation will take (roughly) the same amount of time!

How will we achieve this best-possible speed? Trade-offs, of course!

* [x] garret w
* [x] sarah
* [x] tony

  ## Associative Arrays

Hash Maps store <key,value> pairs in an _associative array_, meaning that each unique key is associated with an index in the array and the corresponding value is stored at that index.

Suppose you wanted to store pairs of _<student ID#, student name>_ in an associative array. An easy (but naive) approach would be to simply store the student’s name at the index equal to their ID#

| Index | Hash table |
|----------|----------|
| 0 | ? |
| 1 | ? |
| ... | ... |
| 12550971 | “Jonathan” |
| ... | ... |
| 18345062 | “Joseph” |
| 18345063 | ? |
| ... | ... |

This would allow you to insert, delete, and retrieve <key,val> pairs all in constant-time ... but memory is a limited resource. What size array would you need if working with 8-digit ID#? How much of that memory is “wasted”?

* [x] sarah
* [x] garret h

---
  ## Hashing

To reduce the amount of memory that is consumed (and to generalize this concept for non-integer keys), we need to perform a _hashing_ of the keys. Through this process, each unique key is mapped to a **hash code** which assigns it an index in a fixed-size array.

In the example above, we could give each key a hash code based on the last four digits of the student ID#. This allows us to store the data with much less wasted space, but at what cost? Does this method always give a unique code to every key?

* [x] ben w
* [x] duc

### Hash Functions

The method of assigning hash codes is known as the _hash function_, and there are a wide variety of these that are used. In order to be an effective hash function, it must have the following properties:

* **If X = Y, then Hash(X) = Hash(Y)**
  In other words, the hash function must be _deterministic_ and give the same hash code for the same input every time. This is to ensure that when we go to retrieve a previously-inserted value we know where to look.

* **If X != Y, then Probability( Hash(X) = Hash(Y) ) must be small**
  In general, we can’t always give each key a unique hash code. The range of possible values for keys may be much larger than we have space for in the hash table. A good hash function, however, will minimize the chances of this happening as much as possible.
  
* **Hash() must run in constant time**
  If the hash function is too expensive to compute, then it defeats the purpose of providing O(1) lookup.
  
### Collisions

In the event that X != Y and Hash(X) = _c_ = Hash(Y), a _collision_ has occurred. We cannot store both X and Y at index _c_, so we will have to incur some extra cost of fixing this collision.

Ideally our hash function would have no collisions, but in reality what most Hash Maps strive for is an even **distribution** of the hash codes. Essentially, the more spread-out the generated hash codes are among the possible values, the less likely it is that we will encounter two keys with the same code.

KC: For the student ID# example, which hash function would provide a better distribution? _First four digits_ or _Last four digits_?

* [x] duc
* [x] dheeraj
* [x] sarah

### Examples

Suppose that we want to maintain a table size of M

One of the simplest general-purpose hash functions would be
  **Hash(X) = X % M**
This requires very little effort, gives each key a valid index, but it does have a slight bias towards the least-significant digits which can affect the distribution of the hash codes.

_User-entered data often rounded_
  M = 10, Keys = {12370, 43560, 12345, 75300, 55555}

_Price-data may be biased as well_
  M = 100, keys = {1599, 99, 1099, 9999, ...}

More sophisticated hash functions will use methods that offer a statistical advantage in cases like this.

