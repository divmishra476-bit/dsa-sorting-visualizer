// Quick Sort — O(n log n) avg time, O(log n) space, Unstable, In-place
const QuickSort = {
  name: 'Quick Sort',
  key: 'quick',
  timeAvg: 'O(n log n)',
  timeBest: 'O(n log n)',
  timeWorst: 'O(n²)',
  space: 'O(log n)',
  stable: false,
  inPlace: true,
  description: 'Quick Sort is a highly efficient divide-and-conquer algorithm. It works by selecting a "pivot" element, partitioning the array so that elements smaller than the pivot come before it and larger elements come after, then recursively sorting the sub-arrays. It is one of the fastest general-purpose sorting algorithms in practice.',
  pseudocode: `quickSort(arr, low, high):
  if low < high
    pivot = partition(arr, low, high)
    quickSort(arr, low, pivot-1)
    quickSort(arr, pivot+1, high)

partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j = low to high-1
    if arr[j] < pivot
      i++; swap(arr[i], arr[j])
  swap(arr[i+1], arr[high])
  return i + 1`,

  async run(arr, callbacks) {
    await this._sort(arr, 0, arr.length - 1, callbacks);
    return Array.from({ length: arr.length }, (_, i) => i);
  },

  async _sort(arr, low, high, callbacks) {
    if (callbacks.isStopped() || low >= high) return;
    const pi = await this._partition(arr, low, high, callbacks);
    if (callbacks.isStopped()) return;
    await this._sort(arr, low, pi - 1, callbacks);
    await this._sort(arr, pi + 1, high, callbacks);
  },

  async _partition(arr, low, high, callbacks) {
    const pivot = arr[high];
    callbacks.onPivot(high);
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (callbacks.isStopped()) return i + 1;
      callbacks.onCompare(j, high, []);
      await callbacks.delay();
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        callbacks.onSwap(i, j, []);
        await callbacks.delay();
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    callbacks.onSwap(i + 1, high, []);
    await callbacks.delay();
    return i + 1;
  }
};
