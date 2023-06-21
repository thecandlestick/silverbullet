```c++
template <typename T>
class ListNode
{
  public:
    T m_data;  // single data item
    ListNode<T> *m_next;  // ptr to next node
}

template <typename T>
class LinkedList
{
  private:
    ListNode<T> *m_head;  // ptr to first node
    int m_size;
};
```