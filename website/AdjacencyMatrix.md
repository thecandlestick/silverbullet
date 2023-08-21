
## Adjacency Matrix Representation

General idea: each coordinate in a 2D-matrix represents possible edge

```c++
using std::vector

vector<vector<int>> AdjacencyMatrix;
```

In the adjacency matrix A, coordinate ```A[i][j]``` will be 1 if there is an edge _<i,j>_ and 0 otherwise.

![](img%2Fundirected-adj-matrix.png)


This concept also extends to weighted graphs, the weights of each edge being stored at their unique coordinate in place of 1 or 0. Note that you must have some way of distinguishing edges from non-edges. Common choices are to give non-edges a weight of 0, -1, or infinity depending on the range of possible values.

![](directed-weighted-adj-matrix.png)

How would you perform operations:

  * adjacent - O(1)
    
  * add_vertex - O(|V|)
    
  * add_edge - O(1)
    
  * get/set_edge_weight - O(1)
    
  * neighbors - O(|V|)


The space-complexity of this data structure is O( |V|^2 ),
which makes it favorable for **dense** graphs. A dense graph is one that has a large number of edges relative to the number of vertices.
