---
tags: template
trigger: hashmap
---

We’ve seen how to implement a map that runs in logarithmic-time as a [[TreeMap]]. This already scales extremely well, but can we do even better?

The _Hash Map_ (or _Hash Table_) is one of the most widely used data structures, as it offers the unique ability to perform constant-time lookup of the data (in the average case). This means that regardless of the size of your collection, a _find_ operation will take (roughly) the same amount of time!

How will we achieve this best-possible speed? Trade-offs, of course!


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

---
  ## Hashing

To reduce the amount of memory that is consumed (and to generalize this concept for non-integer keys), we need to perform a _hashing_ of the keys. Through this process, each unique key is mapped to a **hash code** which assigns it an index in a fixed-size array.

In the example above, we could give each key a hash code based on the last four digits of the student ID#. This allows us to store the data with much less wasted space, but at what cost? Does this method always give a unique code to every key?

### Hash Functions

The method of assigning hash codes is known as the _hash function_, and there are a wide variety of these that are used. In order to be an effective hash function, it must have the following properties:

* **If X = Y, then Hash(X) = Hash(Y)**
  In other words, the hash function must be _deterministic_ and give the same hash code for the same input every time. This is to ensure that when we go to retrieve a previously-inserted value we know where to look.

* **If X != Y, then Probability( Hash(X) = Hash(Y) ) must be small**
  In general, we can’t always give each key a unique hash code. The range of possible values for keys may be much larger than we have space for in the hash table. A good hash function, however, will minimize the chances of this happening as much as possible.
  
* **Hash() must be cheap to compute**
  If the hash function is too expensive to compute, then it defeats the purpose of providing O(1) lookup.
  
### Collisions

In the event that X != Y and Hash(X) = _c_ = Hash(Y), a _collision_ has occurred. We cannot store both X and Y at index _c_, so we will have to incur some extra cost of fixing this collision.

Ideally our hash function would have no collisions, but in reality what most Hash Maps strive for is an even **distribution** of the hash codes. Essentially, the more spread-out the generated hash codes are among the possible values, the less likely it is that we will encounter two keys with the same code.

DQ: For the student ID# example, which hash function would provide a better distribution? _First four digits_ or _Last four digits_?

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


DQ: What if we want to use non-integer keys? 
Can you think of a method for hashing Strings?

---

  ## Collision Management

There are two basics strategies to follow in the event of a collision. In either strategy, it becomes necessary to store the entire <key, value> pair in the hash table. We call this unit of data a **record**.

### Open Hashing (chaining)

In _open hashing_, a collision results in one of the two values being stored outside of the table. Each entry in the hash table is then a linked list of values, and lookup/insertion may involve searching through multiple nodes to find the desired _record_.

![](img%2FOpenHash.gif)_KC: What is the worst-case time complexity for finding a key in a hash map using open hashing?_


As long as the number of collisions at the same hash code is relatively small, then this is a fairly intuitive and easy-to-manage approach. The primary downside, however, is that every collision results in allocating more memory on top of what is already being used.

### Closed Hashing

In _closed hashing_, every key has a **home position** in the table (according to the hash function), but in the event of a collision the **collision policy** will systematically find a “next-best” spot for that key.

The advantage here is that every entry is stored directly in the hash table, which allows us to make guarantees about the amount of memory our Hash Map will consume. The downside is that the collision policy is an added layer of complexity to manage, and just as in open hashing collisions can result in linear-time lookup operations in the worst case. 

Some common choices for a collision policy include **Linear Probing** and **Double Hashing**. 

Linear probing involves searching through a predefined sequence until an empty space is found. This can be as simple as trying the next highest index one at a time, but other variations make larger leaps to avoid having to search through long stretches of entries later on.

Double hashing involves combining the results of two separate hash functions in order to produce the next index to try.


## Search

Searching in a (closed-hashing) hash map follows a two-step process

  1. Compute Hash(X)
  2. Starting at index _Hash(X)_, find the record containing key _X_ by following the collision policy if necessary

This process terminates when either the record is found or an empty index is encountered.

**Try searching the following keys in order**
(Hash(X) = X % 10) (collision policy: Linear Probing - _home++_)
* 846
* 356
* 801

| Index | Hash Table |
|----------|----------|
| 0 | - |
| 1 | 321 |
| 2 | 472 |
| 3 | 993 |
| 4 | - |
| 5 | - |
| 6 | 846 |
| 7 | 356 |
| 8 | - |
| 9 | - |

_KC: Which indices are visited in the search process above?_

_DQ: how would search work for an open-hashing Hash Map?_

## Deletion

Deletion in a (closed-hashing) Hash Map works in a very similar way to search. First, the record with the key desired for removal has to be located via the collision policy. A problem can arise, however, when a record that experienced collisions during insertion is later removed.

**Try deleting the following keys in order**
(Hash(X) = X % 10) (collision policy: Linear Probing - _home++_)
* 846
* 356

| Index | Hash Table |
|----------|----------|
| 0 | - |
| 1 | 321 |
| 2 | 472 |
| 3 | 993 |
| 4 | - |
| 5 | - |
| 6 | 846 |
| 7 | 356 |
| 8 | - |
| 9 | - |

_DQ: What happens in this scenario? How might we fix this issue?_

---
## Maintenance

Just as a [[BST]] must be kept balanced to continue providing efficiency, Hash Maps must also undergo maintenance or they will degrade over time.

### Clearing Tombstones

As calls to insertion/deletion are made, the number of placeholder records (_tombstones_) present in the table grows. Over time this makes the cost of a search operation increase, ultimately violating the assumption of constant-time search if nothing is done.

* **Fix 1**: When a record is found via search, it is immediately relocated to the first available spot in the probing sequence.

* **Fix 2**: Periodically, all records are _re-hashed_ into a brand new hash table.

_DQ: What would be the time complexity of a re-hash operation?_

### Load Factor

Because the hash table is a fixed size, when new records are inserted the _load factor_ (L = N/M where N is # of records, M is table size) increases.

![](img%2Fload-factor.png)

As this load factor approaches 1.0, the performance of the table is _severely_ reduced. This tells us that unlike the [[ArrayList]], we should resize our table long before it becomes full.

A good rule of thumb is to wait until the load factor becomes ~0.5, then double the table size and re-hash all records using a new hash function.