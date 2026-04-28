# ⚡ DSA Sorting Visualizer

An interactive web-based sorting algorithm visualizer built as a **Final Year Project**. Watch 8 different sorting algorithms come to life with real-time animations, audio feedback, step-by-step control, and side-by-side comparisons.

> **🌐 Live Demo:** [https://divmishra476-bit.github.io/dsa-sorting-visualizer/](https://divmishra476-bit.github.io/dsa-sorting-visualizer/)

---

## ✨ Features

| Feature | Description |
|---|---|
| **8 Sorting Algorithms** | Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Counting Sort |
| **Real-Time Visualization** | Canvas-based bar animation with color-coded states |
| **Side-by-Side Comparison** | Race two algorithms on the same dataset |
| **Audio Feedback** | Frequency-mapped tones via Web Audio API |
| **Step-by-Step Mode** | Manually advance one comparison at a time |
| **5 Array Input Modes** | Random, Nearly Sorted, Reversed, Few Unique, Custom |
| **Algorithm Info Panel** | Description, complexity analysis, pseudocode |
| **Responsive Design** | Works on desktop, tablet, and mobile |

---

## 🧠 Algorithms

| Algorithm | Best | Average | Worst | Space | Stable |
|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Selection Sort | O(n²) | O(n²) | O(n²) | O(1) | ❌ |
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | ✅ |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | ✅ |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | ❌ |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | ❌ |
| Shell Sort | O(n log n) | O(n log² n) | O(n²) | O(1) | ❌ |
| Counting Sort | O(n + k) | O(n + k) | O(n + k) | O(k) | ✅ |

---

## 🎨 Color Legend

| Color | Meaning |
|---|---|
| 🔵 Blue | Unsorted element |
| 🟡 Yellow | Being compared |
| 🔴 Red | Being swapped |
| 🟢 Green | Sorted / in final position |
| 🟣 Purple | Pivot (Quick Sort) |

---

## 📁 Project Structure

```
dsa-sorting-visualizer/
├── index.html              ← Landing page
├── visualizer.html         ← Main sorting visualizer
├── compare.html            ← Side-by-side comparison
├── css/
│   ├── base.css            ← Design system & variables
│   ├── components.css      ← Reusable UI components
│   ├── visualizer.css      ← Visualizer page styles
│   ├── compare.css         ← Compare page styles
│   └── landing.css         ← Landing page styles
└── js/
    ├── algorithms/
    │   ├── bubble.js
    │   ├── selection.js
    │   ├── insertion.js
    │   ├── merge.js
    │   ├── quick.js
    │   ├── heap.js
    │   ├── shell.js
    │   └── counting.js
    ├── audio.js            ← Web Audio API engine
    ├── visualizer.js       ← Core rendering & state
    ├── controls.js         ← UI event bindings
    └── compare.js          ← Comparison engine
```

---

## 🚀 Getting Started

No build tools or dependencies required — just open in a browser!

```bash
# Clone the repository
git clone https://github.com/divmishra476-bit/dsa-sorting-visualizer.git

# Open in browser
cd dsa-sorting-visualizer
start index.html
```

Or simply visit the [live demo](https://divmishra476-bit.github.io/dsa-sorting-visualizer/).

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, glassmorphism, gradients, animations
- **JavaScript (ES6+)** — Async/await, Web Audio API, Canvas API
- **Google Fonts** — Inter, JetBrains Mono

No frameworks. No dependencies. Pure vanilla web technologies.

---

## 📸 Pages

### 🏠 Landing Page
- Hero section with animated glow background
- Feature highlights and algorithm showcase

### 📊 Visualizer
- Select from 8 algorithms
- Adjust speed and array size
- Toggle audio and step-by-step mode
- View algorithm description, complexity, and pseudocode

### ⚔️ Compare
- Pick two algorithms and race them
- Same array, independent execution
- Real-time stats and winner announcement

---

## 👨‍💻 Author

**Divyam** — Final Year Project, 2026

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
