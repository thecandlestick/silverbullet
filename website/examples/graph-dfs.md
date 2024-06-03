```c++
DepthFirstTraversal(G, v0):
  df-stack := stack
  marked := map

  push v0 -> df-stack
  add v0 -> marked

  while df-stack not empty:
    c_vert <- top of df-stack
    pop df-stack
    print(c_vert)

    for w adjacent to c_vert:
      if w not in marked
        push w -> df-stack
        add w -> marked
```