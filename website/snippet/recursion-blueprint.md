```
recursive_function(X):

  if X is a base case:
    return solution_X

  else:
    Decompose(X) -> {x1, x2, ..., xn}
    solution_1 <- recursive_function(x1)
    solution_2 <- recursive_function(x2)
    ...
    solution_n <- recursive_function(xn)

    solution_X <- Compose(solution_1, solution_2, ..., solution_n)
    return solution_X
```
