# Hacker CodeQuest 2077

<div align="center">
  <img src="https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Generative%20AI-Integration-fce205?style=for-the-badge" alt="AI Integration" />
</div>

## Overview

**Hacker CodeQuest** is an advanced, gamified learning platform designed to enhance programming proficiency through immersive, interactive exercises. Leveraging modern web technologies and a dynamic Cyberpunk/Synthwave aesthetic, the application transforms static code snippets into highly engaging, cognitive challenges. By utilizing an AI-driven analyzer, the platform autonomously decomposes source code into multi-modal training modules, bridging the gap between passive reading and active coding mastery.

## Key Features

### 🧠 AI-Driven Code Analysis Engine
The core of the application features an intelligent parser that processes raw source code and dynamically generates three distinct challenge vectors:
- **Typing Mode:** Enhances muscle memory and syntactic familiarity. Features a real-time keystroke validation engine with synchronized visual feedback.
- **Syntax Quiz Mode:** Implements an intelligent cloze-deletion system (`___` fill-in-the-blank) to test deep comprehension of algorithms and API surfaces.
- **Logic Sort Mode:** Utilizes drag-and-drop mechanics to reconstruct scrambled logic blocks, reinforcing architectural understanding.

### 🎮 Advanced Gamification Mechanics
- **Persistent State Management:** Features a decoupling of game state from local component lifecycles using **React Portals** and a global `CustomEvent` bus. This allows the mini-game (Balloon Mechanics) to persist seamlessly across routing and level transitions.
- **High-Fidelity Visuals:** Implements a custom CSS architecture utilizing hardware-accelerated animations (e.g., 3D perspective grids, dynamic background positions) to render a seamless 60FPS Synthwave environment.
- **Real-time Particle Systems:** Integrates `canvas-confetti` for deterministic explosion effects triggered by user achievements.

### ⚡ Technical Architecture
- **Framework:** Built on **React** and bundled via **Vite** for instantaneous HMR and optimized production builds.
- **Styling Strategy:** A robust, zero-dependency CSS variable architecture completely overhauling the DOM with a strictly enforced Cyberpunk design system (clip-paths, aggressive box-shadows, and monospace typography).
- **Audio API Integration:** Utilizes the Web Audio API for zero-latency, dynamically synthesized sound effects corresponding to user inputs.

## Installation & Deployment

### Prerequisites
Ensure you have Node.js (v18+) and npm installed on your system.

### Local Setup

```bash
# Clone the repository
git clone https://github.com/ChipDragonz/APP-Luyen-code.git
cd APP-Luyen-code

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Production Build
To create an optimized production bundle:
```bash
npm run build
# The compiled assets will be output to the /dist directory.
```

## Contributing

We welcome technical contributions to Hacker CodeQuest. Please ensure any pull requests adhere to the existing architectural patterns, particularly concerning the global event bus and CSS variable system.

## Support & Sponsorship

If this project has aided in your development workflow or learning journey, consider supporting the maintainer to facilitate future updates and server costs.

**Vietcombank (VCB):** `1024327360`

---
*Developed with a focus on deep work and deliberate practice.*
