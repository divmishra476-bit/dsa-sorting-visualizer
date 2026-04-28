// Insertion Sort — O(n²) time, O(1) space, Stable, In-place
const InsertionSort = {
  name: 'Insertion Sort',
  key: 'insertion',
  timeAvg: 'O(n²)',
  timeBest: 'O(n)',
  timeWorst: 'O(n²)',
  space: 'O(1)',
  stable: true,
  inPlace: true,
  description: 'Insertion Sort builds the final sorted array one item at a time. It picks each element and inserts it into its correct position among the previously sorted elements. It is efficient for small data sets and nearly sorted data, and is often used as part of more advanced algorithms like Tim Sort.',
  pseudocode: `for i = 1 to n
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key
    arr[j+1] = arr[j]
    j = j - 1
  arr[j+1] = key`,

  async run(arr, callbacks) {
    const n = arr.length;
    const sorted = [0];
    for (let i = 1; i < n; i++) {
      if (callbacks.isStopped()) return;
      let key = arr[i];
      let j = i - 1;
      callbacks.onCompare(i, j, sorted);
      await callbacks.delay();
      while (j >= 0 && arr[j] > key) {
        if (callbacks.isStopped()) return;
        arr[j + 1] = arr[j];
        callbacks.onSwap(j, j + 1, sorted);
        await callbacks.delay();
        j--;
      }
      arr[j + 1] = key;
      sorted.push(i);
      callbacks.onCompare(j + 1, -1, sorted);
      await callbacks.delay();
    }
    return Array.from({ length: n }, (_, i) => i);
  }
};
