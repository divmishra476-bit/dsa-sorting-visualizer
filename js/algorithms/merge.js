// Merge Sort — O(n log n) time, O(n) space, Stable, Not in-place
const MergeSort = {
  name: 'Merge Sort',
  key: 'merge',
  timeAvg: 'O(n log n)',
  timeBest: 'O(n log n)',
  timeWorst: 'O(n log n)',
  space: 'O(n)',
  stable: true,
  inPlace: false,
  description: 'Merge Sort is a divide-and-conquer algorithm that divides the array into halves, recursively sorts each half, and then merges the sorted halves. It guarantees O(n log n) performance in all cases, making it one of the most efficient and predictable sorting algorithms.',
  pseudocode: `mergeSort(arr, l, r):
  if l < r
    m = (l + r) / 2
    mergeSort(arr, l, m)
    mergeSort(arr, m+1, r)
    merge(arr, l, m, r)`,

  async run(arr, callbacks) {
    await this._sort(arr, 0, arr.length - 1, callbacks);
    return Array.from({ length: arr.length }, (_, i) => i);
  },

  async _sort(arr, l, r, callbacks) {
    if (callbacks.isStopped() || l >= r) return;
    const m = Math.floor((l + r) / 2);
    await this._sort(arr, l, m, callbacks);
    await this._sort(arr, m + 1, r, callbacks);
    await this._merge(arr, l, m, r, callbacks);
  },

  async _merge(arr, l, m, r, callbacks) {
    const left = arr.slice(l, m + 1);
    const right = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    while (i < left.length && j < right.length) {
      if (callbacks.isStopped()) return;
      callbacks.onCompare(l + i, m + 1 + j, []);
      await callbacks.delay();
      if (left[i] <= right[j]) {
        arr[k++] = left[i++];
      } else {
        arr[k++] = right[j++];
        callbacks.onSwapCount();
      }
    }
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
    const merged = Array.from({ length: r - l + 1 }, (_, x) => l + x);
    callbacks.onMerged(merged);
    await callbacks.delay();
  }
};
