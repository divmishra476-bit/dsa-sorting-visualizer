// Heap Sort — O(n log n) time, O(1) space, Unstable, In-place
const HeapSort = {
  name: 'Heap Sort',
  key: 'heap',
  timeAvg: 'O(n log n)',
  timeBest: 'O(n log n)',
  timeWorst: 'O(n log n)',
  space: 'O(1)',
  stable: false,
  inPlace: true,
  description: 'Heap Sort uses a binary heap data structure. It first builds a max-heap from the input data, then repeatedly extracts the maximum element from the heap and places it at the end of the sorted portion. It guarantees O(n log n) performance and uses constant extra space.',
  pseudocode: `heapSort(arr):
  buildMaxHeap(arr)
  for i = n-1 down to 1
    swap(arr[0], arr[i])
    heapify(arr, 0, i)

heapify(arr, i, n):
  largest = i
  l = 2*i + 1, r = 2*i + 2
  if l < n and arr[l] > arr[largest]
    largest = l
  if r < n and arr[r] > arr[largest]
    largest = r
  if largest != i
    swap(arr[i], arr[largest])
    heapify(arr, largest, n)`,

  async run(arr, callbacks) {
    const n = arr.length;
    const sorted = [];

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (callbacks.isStopped()) return;
      await this._heapify(arr, n, i, sorted, callbacks);
    }

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      if (callbacks.isStopped()) return;
      [arr[0], arr[i]] = [arr[i], arr[0]];
      callbacks.onSwap(0, i, sorted);
      await callbacks.delay();
      sorted.push(i);
      await this._heapify(arr, i, 0, sorted, callbacks);
    }
    sorted.push(0);
    return sorted;
  },

  async _heapify(arr, n, i, sorted, callbacks) {
    let largest = i;
    const l = 2 * i + 1;
    const r = 2 * i + 2;

    if (l < n) {
      if (callbacks.isStopped()) return;
      callbacks.onCompare(l, largest, sorted);
      await callbacks.delay();
      if (arr[l] > arr[largest]) largest = l;
    }

    if (r < n) {
      if (callbacks.isStopped()) return;
      callbacks.onCompare(r, largest, sorted);
      await callbacks.delay();
      if (arr[r] > arr[largest]) largest = r;
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      callbacks.onSwap(i, largest, sorted);
      await callbacks.delay();
      await this._heapify(arr, n, largest, sorted, callbacks);
    }
  }
};
