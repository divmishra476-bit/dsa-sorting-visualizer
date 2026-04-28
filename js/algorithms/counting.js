// Counting Sort — O(n+k) time, O(k) space, Stable, Not in-place
const CountingSort = {
  name: 'Counting Sort',
  key: 'counting',
  timeAvg: 'O(n + k)',
  timeBest: 'O(n + k)',
  timeWorst: 'O(n + k)',
  space: 'O(k)',
  stable: true,
  inPlace: false,
  description: 'Counting Sort is a non-comparison-based algorithm that sorts by counting the occurrences of each distinct value. It creates a count array, calculates cumulative counts, and then places each element in its correct sorted position. It is extremely efficient when the range of values (k) is small relative to the number of elements (n).',
  pseudocode: `countingSort(arr):
  max = findMax(arr)
  count = new array[max+1] of 0
  for each elem in arr
    count[elem]++
  idx = 0
  for i = 0 to max
    while count[i] > 0
      arr[idx++] = i
      count[i]--`,

  async run(arr, callbacks) {
    const n = arr.length;
    if (n === 0) return [];

    const max = Math.max(...arr);
    const count = new Array(max + 1).fill(0);

    // Count occurrences
    for (let i = 0; i < n; i++) {
      if (callbacks.isStopped()) return;
      count[arr[i]]++;
      callbacks.onCompare(i, -1, []);
      await callbacks.delay();
    }

    // Rebuild array
    let idx = 0;
    const sorted = [];
    for (let i = 0; i <= max; i++) {
      while (count[i] > 0) {
        if (callbacks.isStopped()) return;
        arr[idx] = i;
        sorted.push(idx);
        callbacks.onSwap(idx, -1, sorted);
        await callbacks.delay();
        idx++;
        count[i]--;
      }
    }
    return sorted;
  }
};
