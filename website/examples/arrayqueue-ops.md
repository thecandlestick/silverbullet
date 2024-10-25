```c++
template <typename T>
T& ArrayQueue<T>::front()
{
  return data[front];
}

template <typename T>
void ArrayQueue<T>::enqueue(const T& value)
{
  if (front == back && num_elems != 0)
    resize(2*max_elems);
  data[back] = value;
  back = (back+1) % max_elems; //wrap around if necessary
  num_elems++;
}

template <typename T>
void ArrayQueue<T>::dequeue()
{
  if (num_elems > 0)
  {
    front = (front+1) % max_elems; //wrap around if necessary
    num_elems--;
  }
  // (Optional)
  if (num_elems < 0.25*max_elems) // free memory if nearly empty
    resize(0.5*max_elems);
}
```