
## Topological Sort

**Motivation:**
Given a collection of tasks, some of which are _prerequisites_ of each other, produce a valid order to perform said tasks

 _Examples:_
* Construction Projects 👷
* Degree Planning 📚
* Speedrun Routing 🎮

**Graph Formulation:**

Each task is given a vertex in a directed graph. An edge <A,B> means that task A is a prerequisite for task B.

![](img%2Fdag.png)

It is required that the tasks form a **directed acyclic graph(DAG)**, otherwise it is impossible to complete the tasks while respecting prerequisites.


### Solution via DFS

Idea: 
* If a task is not a prereq for any other, it can safely go _last_
* Work backwards with DFS, choosing tasks with no current prereqs
* Reverse the order produced

```
###
# Prints valid order in reverse
###

dfs(G, v, Marked):
  v -> Marked

  for w in v.neighbors:
    if w not in Marked:
      dfs(G, w, Marked)

  print(v)


Topological-sort(G):  # DFS might not reach all vertex in one go
  :Marked

  while size(Marked) < size(G.V):
    select unmarked v in G.V
    dfs(G, v, Marked)

```

[Visualization](https://www.cs.usfca.edu/~galles/visualization/TopoSortDFS.html)

### Solution via BFS

Idea:
* Pre-process the graph to get # of prereqs for each task
* Perform BFS, reducing the # of prereqs as you go
* Tasks only enqueued when they have 0 prereqs

```
###
# Prints valid order
###

Topological-sort(G)

  :preReqs
  for e in G.E:     # <x,y> == <e.first,e.second>
    t <- e.second   # task t has a prerequisite
    preReqs[t] += 1

  :Marked
  :bfs-queue

  do:
    for v in preReqs:
      if preReq[v] == 0:
        bfs-queue.enqueue(v)     # enqueue all tasks without prereqs

    curr_v <- bfs-queue.front()
    print(curr_v)
    bfs-queue.dequeue()
  
    for w in curr_v.neighbors(): 
      preReq[w] -= 1             # eliminate prereq for adjacent tasks

  while bfs-queue not empty
```