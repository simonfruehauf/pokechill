# PokeChill

**PokeChill** is a web-based turn-based RPG with a strong focus on seasonal events, exploration, and monster collecting. Players can assemble a team of unique monsters, train them, and send them out to explore different regions that change with the seasons.

## Features

- **Turn-Based Combat**: Engage in strategic turn-based battles using a roster of collected monsters.
- **Seasonal Exploration**:
    - The world map is divided into regions with different monsters.
    - Regions are affected by seasons (Spring, Summer, Autumn, Winter), which dynamically change the available monsters and encounters.
- **Monster Training & Collection**:
    - Collect monsters through exploration and events.
    - Train monsters to level them up and improve their stats.
    - Some monsters can evolve into more powerful forms.
- **Battle System**:
    - Features "Critical Chance" and "Base Speed" for strategic depth.
    - Includes unique mechanics like "Perfect Parry" (99% defense success).
- **UI & Visuals**:
    - A modern, clean interface with dark mode support.
    - Smooth animations for combat and UI transitions.
    - Dedicated sections for Pokedex, Team Management, and Exploration.


## Project Structure

- `index.html`: The main entry point of the application.
- `css/`: Contains stylesheets for the application.
- `data/`: Houses core game data such as `pokemon.js`, `moves.js`, `items.js`, etc.
- `images/`: All game assets, including sprites, UI elements, and backgrounds.
- `scripts/`: Contains the core logic of the game.
    - `combat.js`: Handles battle logic and mechanics.
    - `data/`: Scripts to generate and manage game data.
    - `explore.js`: Logic for the exploration and world map features.
    - `main.js`: The main application loop and initialization.
    - `team.js`: Team management and player data handling.
    - `visual.js`: Visual effects and UI updates.
    
## Development

### Adding New Content

Content is primarily driven by the data files in the `data/` directory.

- **Pokemon**: Defined in `data/pokemon.js`.
- **Moves**: Defined in `data/moves.js`.
- **Items**: Defined in `data/items.js`.
- **Abilities**: Defined in `data/abilities.js`.
- **Regions/Areas**: Defined in `data/areas.js`.
