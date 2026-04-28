// Shell Sort — O(n log² n) time, O(1) space, Unstable, In-place
const ShellSort = {
  name: 'Shell Sort',
  key: 'shell',
  timeAvg: 'O(n log² n)',
  timeBest: 'O(n log n)',
  timeWorst: 'O(n²)',
  space: 'O(1)',
  stable: false,
  inPlace: true,
  description: 'Shell Sort is a generalization of Insertion Sort that allows the exchange of elements that are far apart. It uses a sequence of decreasing gap sizes (here using Knuth\'s sequence) to partially sort the array, making the final insertion sort pass very efficient. It bridges the gap between simple O(n²) and advanced O(n log n) algorithms.',
  pseudocode: `shellSort(arr):
  gap = 1
  while gap < n/3
    gap = gap * 3 + 1
  while gap >= 1
    for i = gap to n
      key = arr[i]
      j = i
      while j >= gap and arr[j-gap] > key
        arr[j] = arr[j-gap]
        j -= gap
      arr[j] = key
    gap = (gap - 1) / 3`,

  async run(arr, callbacks) {
    const n = arr.length;
    // Knuth's gap sequence: 1, 4, 13, 40, 121 ...
    let gap = 1;
    while (gap < Math.floor(n / 3)) gap = gap * 3 + 1;

    while (gap >= 1) {
      for (let i = gap; i < n; i++) {
        if (callbacks.isStopped()) return;
        let key = arr[i];
        let j = i;
        callbacks.onCompare(j, j - gap, []);
        await callbacks.delay();
        while (j >= gap && arr[j - gap] > key) {
          if (callbacks.isStopped()) return;
          arr[j] = arr[j - gap];
          callbacks.onSwap(j, j - gap, []);
          await callbacks.delay();
          j -= gap;
        }
        arr[j] = key;
      }
      gap = Math.floor((gap - 1) / 3);
    }
    return Array.from({ length: n }, (_, i) => i);
  }
};
