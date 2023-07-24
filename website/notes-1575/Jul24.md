

Date: 2023-07-24
Recording: https://umsystem.hosted.panopto.com/Panopto/Pages/Viewer.aspx?id=032ffb8d-555a-4092-8ff6-b049014c5911

Reminders:
* [ ] be on lookout for feedback survey
* [ ] quiz 6 is due tonight (heaps)
* [ ] pa06 + resubmission due friday

Objectives:
* [x] continue Hash Map

---


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

Hash(S) = sum (ascii(char)) % table_size

* [ ] garret w
* [ ] sarah

---

  ## Collision Management

There are two basics strategies to follow in the event of a collision. In either strategy, it becomes necessary to store the entire <key, value> pair in the hash table. We call this unit of data a **record**.

### Open Hashing (chaining)

In _open hashing_, a collision results in one of the two values being stored outside of the table. Each entry in the hash table is then a linked list of values, and lookup/insertion may involve searching through two or more nodes to find the desired _record_.

![](img%2FOpenHash.gif)
As long as the number of collisions at the same hash code is relatively small, then this is a fairly intuitive and easy-to-manage approach. The primary downside, however, is that every collision results in allocating more memory on top of what is already being used.

### Closed Hashing

In _closed hashing_, every key has a **home position** in the table (according to the hash function), but in the event of a collision the **collision policy** will systematically find a “next-best” spot for that key.


The advantage here is that every entry is stored directly in the hash table, which allows us to make guarantees about the amount of memory our Hash Map will consume. The downside is that the collision policy is an added layer of complexity to manage, and just as in open hashing collisions can result in non-constant lookup times in the worst case. 

Some common choices for a collision policy include **Linear Probing** and **Double Hashing**. 

Linear probing involves searching through a predefined sequence until an empty space is found. This can be as simple as trying the next highest index one at a time, but other variations make larger leaps to avoid having to search through long stretches of entries later on.

Double hashing involves combining the results of two separate hash functions in order to produce the next index to try. Consider, why is a second hash function necessary? Can we not use the original hash function to “try again?” 

Hash2(X) * Hash(X)

* [ ] sarah

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

* [ ] sarah
* [ ] doug
* [ ] tony
* [ ] garret w

_KC: how would search work for an open-hashing Hash Map?_

* [ ] sarah
* [ ] tony

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
| 6 | T |
| 7 | T |
| 8 | 496 |
| 9 | - |

_DQ: What happens in this scenario? How might we fix this issue?_

Leave a ‘tombstone’ as placeholder when deleting

* [ ] doug
* [ ] sarah

---
## Maintenance

Just as a [[BST]] must be kept balanced to continue providing efficiency, Hash Maps must also undergo maintenance or they will degrade over time.
