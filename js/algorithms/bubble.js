// Bubble Sort — O(n²) time, O(1) space, Stable, In-place
const BubbleSort = {
  name: 'Bubble Sort',
  key: 'bubble',
  timeAvg: 'O(n²)',
  timeBest: 'O(n)',
  timeWorst: 'O(n²)',
  space: 'O(1)',
  stable: true,
  inPlace: true,
  description: 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. It gets its name because smaller elements "bubble" to the top of the list.',
  pseudocode: `for i = 0 to n-1
  for j = 0 to n-i-2
    if arr[j] > arr[j+1]
      swap(arr[j], arr[j+1])`,

  async run(arr, callbacks) {
    const n = arr.length;
    const sorted = [];
    for (let i = 0; i < n - 1; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        if (callbacks.isStopped()) return;
        callbacks.onCompare(j, j + 1, sorted);
        await callbacks.delay();
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          callbacks.onSwap(j, j + 1, sorted);
          await callbacks.delay();
        }
      }
      sorted.push(n - 1 - i);
      if (!swapped) break; // Optimization: early exit
    }
    sorted.push(0);
    return sorted;
  }
};
