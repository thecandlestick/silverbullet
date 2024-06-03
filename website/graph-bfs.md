```c++
BreadthFirstTraversal(G, v0):
  bf-queue := queue
  marked := map

  enqueue v0 -> bf-queue
  add v0 -> marked

  while bf-queue not empty:
    c_vert <- front of bf-queue
    dequeue bf-queue
    print(c_vert)

    for w adjacent to c_vert:
      if w not in marked
        enqueue w -> bf-queue
        add w -> marked
```