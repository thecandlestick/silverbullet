```c++
template <typename T>
class ListNode
{
  public:
    T data;  // single data item
    ListNode<T> *next;  // ptr to next node
}

template <typename T>
class LinkedList
{
  private:
    ListNode<T> *head;  // ptr to first node
    int num_elems;

  public:
    // operations
};
```