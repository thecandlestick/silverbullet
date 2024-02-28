```c++
template <typename T>
void erase( LinkedListIterator<T> it )
{
  if (it->next != nullptr) { // step 0
    ListNode<T> *tmp = it -> next; // step 1
    it -> data = tmp -> data; // step 2
    it -> next = tmp -> next; //
    delete tmp; // step 3
    tmp = nullptr;
    num_elems--; // step 4
  } else { throw "tantrum"; }
}

*it = *tmp; //optional
```