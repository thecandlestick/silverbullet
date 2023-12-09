
## Adjacency List Representation

General idea: each vertex maintains a list of its neighbors

```c++
using std::vector
using std::forward_list

vector<forward_list<int>> AdjacencyList;
```

In the adjacency list A, index ```A[i]``` will be a linked list of all vertices adjacent to vertex _i_.

![](img%2Fadj-list.png)

To extend to a weighted graph implementation, simply store weight alongside the neighboring vertex id. This can be a more memory-efficient choice of implementation, as no memory is allocated for non-edges.


How would you perform operations:

  * adjacent - O(|E|)
    
  * add_vertex - O(1)* _average case_
    
  * add_edge - O(1)
    
  * get/set_edge_weight - O(|E|)
    
  * neighbors - O(1)


The space-complexity of this data structure is O( |V| + |E| ),
which makes it favorable for **sparse** graphs. A sparse graph is one that has a small number of edges relative to the number of vertices.
