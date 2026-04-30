# Monsters and Chill

Welcome to **Monsters and Chill** (also known as Pokechill), a fan-made, browser-based incremental idle game inspired by the Pokémon universe! Start your journey, capture monsters, explore dungeons, and build your ultimate team—all from the comfort of your web browser.

## Features

- **Idle Progression**: Your team will continue to train and gather resources even while you're focused on other things.
- **Team Building**: Catch a wide variety of monsters, manage their stats, IVs, abilities, and items to create the perfect team.
- **Exploration**: Journey through wild areas, dungeons, and dimension portals to find rare encounters and special rewards.
- **Extensive Mechanics**: Take advantage of genetic modification, training regimens, item crafting (like curry!), and seasonal events.
- **Completely Client-Side**: No servers or accounts needed. Your progress is saved entirely in your browser's local storage.

## How to Play

Since the game runs entirely in the browser, you don't need any complex setup. You have a few options to start playing:

1. **Play Online**: Visit [play-pokechill.github.io](https://play-pokechill.github.io) (if hosted) to play directly in your browser.
2. **Play Locally**:
   - Clone or download this repository.
   - Open `index.html` in your favorite modern web browser.
   - Enjoy the game!

## Saving Your Game

Your game data is saved automatically to your browser's `localStorage`. However, it's highly recommended to use the **Settings -> Export Data** feature regularly to keep a backup of your progress, especially if you plan to clear your browser data or switch devices.

## TODO: Future Improvements

The game currently uses a vanilla HTML/CSS/JS architecture. To ensure long-term maintainability, scalability, and an easier experience for contributors, the following architectural improvements are proposed:

- [ ] **Migrate to TypeScript**: Introduce strict typing to prevent common runtime bugs and improve developer experience with better autocomplete and refactoring tools.
- [ ] **Adopt a Frontend Framework**: Move away from a single monolithic `index.html` file by adopting a component-based framework like React, Vue, or Svelte. This will make UI state management significantly easier to handle.
- [ ] **Implement a Build Step/Bundler**: Use Vite, Webpack, or Rollup to bundle JavaScript, manage dependencies, and minify assets for production.
- [ ] **Modularize CSS**: Transition from a single `styles.css` file to CSS Modules, SCSS, or Tailwind CSS to prevent style clashes and keep styling tied directly to specific UI components.
- [ ] **Refactor Game State Management**: Introduce a dedicated state management library (like Redux, Zustand, or Vuex) to handle the complex underlying game mechanics (inventory, team stats, progression) cleanly.

## Disclaimer

**Monsters and Chill is a completely unofficial, non-profit fan project.**

All characters, monsters, and related intellectual properties featured in this game are the exclusive property of Nintendo, Creatures Inc., and The Pokémon Company.

Any use of these assets is solely for non-commercial, entertainment, and educational purposes. No ownership is claimed over these IPs, and all rights remain with their respective owners. Please support the official releases!

*Credits: Original concept by Duck, revised by Bee. Various sprites provided by Pokemon Showdown and related artists.*