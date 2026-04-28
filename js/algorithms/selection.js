// Selection Sort — O(n²) time, O(1) space, Unstable, In-place
const SelectionSort = {
  name: 'Selection Sort',
  key: 'selection',
  timeAvg: 'O(n²)',
  timeBest: 'O(n²)',
  timeWorst: 'O(n²)',
  space: 'O(1)',
  stable: false,
  inPlace: true,
  description: 'Selection Sort divides the input list into a sorted and unsorted region. It repeatedly selects the smallest (or largest) element from the unsorted region and moves it to the end of the sorted region. It performs well on small lists but is inefficient on large ones.',
  pseudocode: `for i = 0 to n-1
  minIdx = i
  for j = i+1 to n
    if arr[j] < arr[minIdx]
      minIdx = j
  swap(arr[i], arr[minIdx])`,

  async run(arr, callbacks) {
    const n = arr.length;
    const sorted = [];
    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (callbacks.isStopped()) return;
        callbacks.onCompare(minIdx, j, sorted);
        await callbacks.delay();
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        callbacks.onSwap(i, minIdx, sorted);
        await callbacks.delay();
      }
      sorted.push(i);
    }
    sorted.push(n - 1);
    return sorted;
  }
};
