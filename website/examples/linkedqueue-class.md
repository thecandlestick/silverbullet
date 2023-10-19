```c++
template <typename T>
class QueueNode
{
  public:
    T m_data;  // single data item
    QueueNode<T> *m_next;  // ptr to next node
}

template <typename T>
class LinkedQueue
{
  private:
    QueueNode<T> *m_sentinel;  // ptr to sentinel node
    int m_size;
  public:
  //OPERATIONS
    T& front();
    void enqueue(const T& value);
    void dequeue();
};
```