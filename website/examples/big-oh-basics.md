**Claim:**
```latex
n^2 \text{ is } O(3n^2 + n)
```
**Proof:**

Let C = 1, n0 = 1

* n^2 <= C*(3n^2 + n)   _for n > n0_
* n^2 <= 3n^2 + n      _for n > 1_
* 0 <= 2n^2 + n 

_but now..._

**Claim:**
```latex
3n^2 + n \text{ is } O(n^2)
```
**Proof:**

Let C = 4, n0 = 1

* 3n^2 + n <= C*n^2  _for n > n0_
* 3n^2 + n <= 4n^2   _for n > 1_
* n <= n^2           _for n > 1_
  