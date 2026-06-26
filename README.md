<div align="center">

# ✦ TYPING SPEED

### A glassmorphic typing speed test with live WPM, detailed stats, and persistent history — built in pure HTML, CSS & JS.

<br/>

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?style=for-the-badge)
![Local Storage](https://img.shields.io/badge/storage-localStorage-blueviolet?style=for-the-badge)

<br/>

> Live WPM · Accuracy · Mistakes · Character stats · Full history log

<br/>

</div>

---

## ✦ Features

### ⚡ Live Stats While You Type
Three live counters update in real time as you type — no waiting until the end to see how you're doing.

| Counter | Updates |
|---------|---------|
| WPM | Every second, based on correct characters |
| Accuracy | Every keystroke |
| Time Left | Countdown from selected duration |

A smooth gradient progress bar fills across the top as time runs out.

### 🎯 Four Time Modes
Switch between test durations before starting:

```
15s  ·  30s  ·  60s  ·  120s
```

### 📊 Detailed Results Screen
When the timer hits zero, a full results card animates in:

| Stat | What it means |
|------|--------------|
| WPM | Words per minute (correct chars ÷ 5 ÷ minutes) |
| Accuracy | % of keystrokes that were correct |
| Time | How long the test actually ran |
| Correct chars | Total correctly typed characters |
| Wrong chars | Total incorrectly typed characters |
| Total chars | Every keystroke made |
| Words | Number of words completed |

### 📋 Persistent History
Every completed test is saved to `localStorage`. The history panel shows your last 20 runs with WPM, accuracy, time, mistakes, and timestamp — so you can track your improvement over time.

### ✨ Typing Experience
- Random words from a 200-word pool, shuffled every test
- Each letter colours **green** when correct, **red** when wrong
- Blinking purple cursor follows your position
- Words scroll smoothly as you advance through the test
- `Backspace` deletes the last character
- `Tab` instantly restarts the test
- `Space` advances to the next word

---

## ✦ Getting Started

No build step. No npm. No config. Just open a file.

```bash
git clone https://github.com/heyfaraninam/typing-speed.git
cd typing-speed
open index.html
```

---

## ✦ File Structure

```
typing-speed/
├── index.html     # Layout, typing area, results card, history panel
├── styles.css     # Glassmorphism, letter colours, animations, history rows
└── script.js         # Word generation, timer, input handling, stats, localStorage
```

---

## ✦ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Any key | Start the test |
| `Space` | Advance to next word |
| `Backspace` | Delete last character |
| `Tab` | Restart test instantly |

---

## ✦ How WPM is Calculated

The standard WPM formula used by all major typing tests:

```
WPM = (correct characters ÷ 5) ÷ elapsed minutes
```

Dividing by 5 converts characters to "words" — the industry standard definition of one word being 5 characters.

---

## ✦ Browser Support

| Browser | Support |
|---------|---------|
| Chrome 76+ | ✅ Full |
| Firefox 103+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 79+ | ✅ Full |

---

## ✦ Part of a Series

This is part of a growing collection of beautiful, zero-dependency web apps:

| Project | Description |
|---------|-------------|
| [Calculator](https://github.com/heyfaraninam/Calculator) | Glassmorphic calculator with 4 themes, scientific mode & history |
| [Notes](https://github.com/heyfaraninam/Notes) | Glassmorphic notes app with tags, pinning & instant search |
| [Weather](https://github.com/heyfaraninam/Weather) | Glassmorphic weather app with real-time data & 5-day forecast |
| **Typing Speed** | This project |

---

## ✦ License

MIT — free to use, modify, and ship.

---

<div align="center">

Made with care · pure HTML · CSS · JS · no frameworks needed

</div>
