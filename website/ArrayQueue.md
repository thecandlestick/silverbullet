
Consider the following queue:

  _front_ -> **< a0, a1, a2, ... , an >** <- _back_

Can [[ArrayList]] operations efficiently implement _front, enqueue, dequeue?_ 

How might we re-engineer the ArrayQueue to make all 3 operations into constant-time algorithms?

  _front / head_ -> **< a0, a1, a2, ... , an >** <- _back / tail_ 

Offers quick enqueue operations, but dequeue requires shifting elements... _or does it..._ enter the _circular array_

[[examples/arrayqueue-class]]
<!-- #include [[examples/arrayqueue-class]] -->
```c++
#define MIN_CAPACITY 4
template <typename T>
class ArrayQueue
{
  private:
    int m_front;      // index-of start of valid data
    int m_back;       // index-of next available space   
    int m_capacity;   // length of storage array
    int m_size;       // # of valid data elements
    T *m_data;        // pointer to storage array
    void resize(int new_capacity);
  public:
    ArrayList() : m_front (0), m_back (0), m_capacity (MIN_CAPACITY) 
                { m_data = new T[m_capacity]; } // default constructor

    //OPERATIONS
    T& top();
    void enqueue(const T& value);
    void dequeue();
};
```
<!-- /include -->


[Visualization](https://www.cs.usfca.edu/~galles/visualization/QueueArray.html)


[[examples/arrayqueue-ops]]
<!-- #include [[examples/arrayqueue-ops]] -->
```c++
template <typename T>
T& ArrayQueue<T>::front()
{
  return m_data[m_front];
}

template <typename T>
void ArrayQueue<T>::enqueue(const T& value)
{
  if (m_front == m_back && m_size != 0)
    resize(2*m_capacity);
  m_data[m_back] = value;
  m_back = (m_back+1) % m_capacity; //wrap around if necessary
  size++;
}

template <typename T>
void ArrayQueue<T>::dequeue()
{
  if (m_size > 0)
  {
    m_front = (m_front+1) % m_capacity; //wrap around if necessary
    m_size--;
  }
  if (m_size < 0.25*m_capacity)
    resize(0.5*m_capacity);
}
```
<!-- /include -->
