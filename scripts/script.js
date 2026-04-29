let saved = {}

//--Workarround for IOS not appreciating the press-hold function. It fires a contextmenu at the pointer location
const isIOS = (() => {
  const ua = navigator.userAgent;
  const platform = navigator.platform;

  return (
    /iPhone|iPod|iPad/.test(platform) ||
    (platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
})();


(function () {
  if (!isIOS) return;

  let timer;
  const LONG_PRESS = 500;

  document.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;

    timer = setTimeout(() => {
      const t = e.touches[0];

      //Simulate event at position of the finger
      const evt = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: t.clientX,
        clientY: t.clientY
      });

      t.target.dispatchEvent(evt);
    }, LONG_PRESS);
  }, { passive: false });

  document.addEventListener("touchend", () => clearTimeout(timer));
  document.addEventListener("touchmove", () => clearTimeout(timer));
})();



//--Updates game version, used for firing retroactive features
saved.version = undefined
function updateGameVersion() {

  if (saved.version<0.2) {
    saved.tutorial = false
    saved.tutorialStep = "intro"
  }

  if (saved.version<0.9) {
    let bottlecapGot = 0
    for (let i in areas){
      if (areas[i].type!=="vs") continue
      if (areas[i].defeated!=true) continue
      bottlecapGot++
    }
    item.bottleCap.got += bottlecapGot
    item.goldenBottleCap.got += parseInt((bottlecapGot/3).toFixed(0))
    document.getElementById("tooltipTitle").innerHTML = `New items!`
    document.getElementById("tooltipTop").style.display = "none"    
    document.getElementById("tooltipMid").innerHTML = `Due to the vs rewards update you have been rewarded for your defeated trainers:`
    document.getElementById("tooltipBottom").innerHTML = `x${bottlecapGot} Bottle Caps | x${(bottlecapGot/3).toFixed(0)} Golden Bottle Caps`
    openTooltip()
  }

  if (saved.version<1.6){
  //moved to a new team format
  saved.previewTeams = {}
  for (let n = 1; n <= 30; n++) {
    const key = `preview${n}`;
    saved.previewTeams[key] = {};
    for (let s = 1; s <= 6; s++) {
      saved.previewTeams[key][`slot${s}`] = { item: undefined, pkmn: undefined };
    }
  }

  // Migrate old preview slots (1-6) into the new format
  for (let n = 1; n <= 6; n++) {
    if (saved[`preview${n}`]) saved.previewTeams[`preview${n}`] = saved[`preview${n}`];
    saved[`preview${n}`] = undefined;
  }

  saved.currentPreviewTeam = "preview1"

  }


  if (saved.version<1.7){
  saved.currentSpiralingType = `normal`
  saved.maxSpiralFloor = 1
  saved.currentSpiralFloor = 1
  saved.spiralRewardsClaimed = 0
  }

  if (saved.version<2.2){
  saved.tutorialStep = `none`
  }

  if (saved.version<2.6){
  saved.mysteryGiftClaimed = false
  }

  if (saved.version<3.0){
  saved.factoryRewardsClaimed = 0
  saved.maxFactoryScore = 0
  if (item.goldenBottleCap.got>0){
    document.getElementById("tooltipTitle").innerHTML = `Version Notice`
    document.getElementById("tooltipTop").style.display = "none"    
    document.getElementById("tooltipMid").innerHTML = `Your golden bottlecaps have been exchanged into bottlecaps due to frontier changes`
    document.getElementById("tooltipBottom").style.display = "none"    
    openTooltip()
  }

  item.bottleCap.got += (item.goldenBottleCap.got*10)
  item.goldenBottleCap.got = 0
  }

  if (saved.version<3.1){
    team.slot1.turn = 1
    team.slot2.turn = 1
    team.slot3.turn = 1
    team.slot4.turn = 1
    team.slot5.turn = 1
    team.slot6.turn = 1
  }


  if (saved.version<3.2){
    saved.arenaCurrentTrainer = 1
    createArenaCards()
    saved.arenaActiveCard = 1
  }


  if (saved.version<3.3){
  saved.mysteryGiftClaimed = false
  saved.theme = `default`
  changeTheme()
  }


  if (saved.version<3.7){
  createArenaCards()
  }



  if (saved.version<4.0){
  saved.lastDimensionRotation = 10
  assignMegaDimension()
  }

  if (saved.version<4.3){
    saved.lastShopApricornReset = 100
    updateItemShop()
    saved.mysteryGiftClaimed = false
  }

  if (saved.version<4.5){
    saved.lastShopApricornReset = 101
  }

  if (saved.version<4.9){
    saved.tagSystemTags = [];
  }

  saved.version = 5.0
  document.getElementById(`game-version`).innerHTML = `v${saved.version}`
}



//--Theme settings
saved.theme = "default"

document.getElementById("settings-theme").addEventListener("change", e => {
  saved.theme = document.getElementById(`settings-theme`).value
  changeTheme()
});

saved.hideGotPkmn = "false"
document.getElementById("settings-hide-got").addEventListener("change", e => {
  saved.hideGotPkmn = document.getElementById(`settings-hide-got`).value
});

saved.alternateWildRotation = "false"
document.getElementById("settings-alternate-rotation").addEventListener("change", e => {
  saved.alternateWildRotation = document.getElementById(`settings-alternate-rotation`).value
});

//--Theme color definitions (add new themes here)
const themes = {
  dark:    { dark1: '#36342F', dark2: '#444138', light1: '#94886B', light2: '#ECDEB7' },
  verdant: { dark1: '#32493dff', dark2: '#475243ff', light1: '#94886B', light2: '#ECDEB7' },
  lilac:   { dark1: '#454152ff', dark2: '#4d5163ff', light1: '#6b9486ff', light2: '#b7ddecff' },
  cherry:  { dark1: '#523a3eff', dark2: '#6b4c4dff', light1: '#a78b66ff', light2: '#F9E7B2' },
  coral:   { dark1: '#3A4048', dark2: '#42424D', light1: '#E07B6A', light2: '#FFE4DB' },
  spooky:  { dark1: '#292825', dark2: '#332f2b', light1: '#b46c42', light2: '#d3c49d' },
  onyx:    { dark1: '#1a1717ff', dark2: '#1f2222ff', light1: '#3c3a49ff', light2: '#707083ff' },
  oled:    { dark1: '#000000ff', dark2: '#0f0f0fff', light1: '#222225ff', light2: '#37373dff' },
};

function changeTheme(){

  let theme = saved.theme
  if (saved.theme == "default" && saved.currentSeason == season.halloween.id) theme = `spooky`
  if (saved.theme == "default" && saved.currentSeason == undefined) theme = `dark`

  document.querySelectorAll('.season-background').forEach(el => {
    el.classList.remove('season-background-halloween');
  });

  // Apply theme colors from the themes table
  const colors = themes[theme] || themes.dark;
  document.documentElement.style.setProperty('--dark1', colors.dark1);
  document.documentElement.style.setProperty('--dark2', colors.dark2);
  document.documentElement.style.setProperty('--light1', colors.light1);
  document.documentElement.style.setProperty('--light2', colors.light2);

  // Spooky theme special: add halloween background class
  if (theme === "spooky") {
    document.querySelectorAll('.season-background').forEach(el => {
      el.classList.add('season-background-halloween');
    });
  }
}


//--Automatically trims all images with specified class. Used for all Pokemon sprites
//--Sprite trim cache: stores trimmed data URLs keyed by original source URL
const spriteTrimCache = new Map();

async function trimTransparent(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let top = null, bottom = null, left = null, right = null;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha !== 0) {
        if (top === null) top = y;
        bottom = y;
        if (left === null || x < left) left = x;
        if (right === null || x > right) right = x;
      }
    }
  }

  const trimmedW = right - left + 1;
  const trimmedH = bottom - top + 1;

  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = trimmedW;
  trimmedCanvas.height = trimmedH;

  trimmedCanvas.getContext('2d').drawImage(
    canvas,
    left, top, trimmedW, trimmedH,
    0, 0, trimmedW, trimmedH
  );

  return trimmedCanvas.toDataURL();
}

async function processSprite(img) {
  if (!img.src) return;

  // Prevents unnecesary trimming
  if (img.dataset.lastSrc === img.src) return;

  const originalSrc = img.src;
  img.dataset.lastSrc = originalSrc;

  // Serve from cache if this sprite URL was already trimmed
  if (spriteTrimCache.has(originalSrc)) {
    img.src = spriteTrimCache.get(originalSrc);
    return;
  }

  if (!img.complete) {
    await new Promise(resolve => img.onload = resolve);
  }

  try {
    const result = await trimTransparent(img);
    spriteTrimCache.set(originalSrc, result);
    img.src = result;
  } catch (e) {
    console.error("Error trimming sprite:", e);
  }
}

document.querySelectorAll("img.sprite-trim").forEach(processSprite);

//Observe changes to apply trimming
const observer = new MutationObserver(mutations => {
  for (const m of mutations) {
    if (m.type === "childList") {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;

        if (
          node.tagName === "IMG" &&
          node.classList.contains("sprite-trim") &&
          !node.closest("#pokedex-list")
        ) {
          processSprite(node);
        }

        if (node.querySelectorAll) {
          node
            .querySelectorAll("img.sprite-trim:not(#pokedex-list img)")
            .forEach(processSprite);
        }
      }
    }

    if (m.type === "attributes" && m.attributeName === "src") {
      const img = m.target;

      if (
        img.tagName === "IMG" &&
        img.classList.contains("sprite-trim") &&
        !img.closest("#pokedex-list")
      ) {
        processSprite(img);
      }
    }
  }
});

observer.observe(document.body, { 
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ["src"]
});



//--Gives Pokemon appropiate moves


function learnPkmnMove(id, level, mod, exclude = []) {
    let attempts = 0;
    const MAX_ATTEMPTS = 100;
    while (attempts++ < MAX_ATTEMPTS) {
        const types = pkmn[id].type;
        const knownMoves = pkmn[id].movepool || [];
        let tier = 1;
        if (level >= 10 && rng(0.25)) tier++;
        if (level >= 20 && rng(0.25)) tier++;
        if (level >= 30 && rng(0.25)) tier++;
        if (level >= 50 && rng(0.25)) tier++;
        if (level >= 60 && rng(0.25)) tier++;
        tier = Math.min(tier, 3);
        const allMoves = Object.keys(move).filter(m => {
            const data = move[m];
            const notKnown = mod !== "wild" ? !knownMoves.includes(m) : true;
            return data.rarity === tier && notKnown;
        });
        
        if (!allMoves.length) return undefined;
        
        const typeMatch = [];
        const movesetMatch = [];
        const allTag = [];
        
        allMoves.forEach(m => {
            const data = move[m];
            const canLearn = data.moveset.includes("all") || types.some(t => data.moveset.includes(t));
            
            if (!canLearn) return; 
            
            if (types.includes(data.type)) {
                typeMatch.push(m);
            } else if (types.some(t => data.moveset.includes(t))) {
                movesetMatch.push(m);
            } else if (data.moveset.includes("all")) {
                allTag.push(m);
            }
        });
        
        if (level === 1) {
            if (!typeMatch.length) continue;
            const chosenMove = typeMatch[Math.floor(Math.random() * typeMatch.length)];
            if (move[chosenMove].power <= 0) continue;
            return move[chosenMove].id;
        }
        
        let chosenList;
        if (rng(0.70) && typeMatch.length) {
            chosenList = typeMatch;
        } else if (rng(0.50) && movesetMatch.length) {
            chosenList = movesetMatch;
        } else if (allTag.length) {
            chosenList = allTag;
        } else {
            continue;
        }
        
        const chosenMove = chosenList[Math.floor(Math.random() * chosenList.length)];

        if (exclude.includes(move[chosenMove].id)) continue; // prevents dupes for trainers
        if (move[chosenMove].restricted && pkmn[id].movepool.length<3) continue //prevents restricted moveset locks
        if (saved.currentArea == areas.training.id && mod == "wild" && move[chosenMove].power==0) continue //no setup moves in training
        if (mod == "wild" && move[chosenMove].notUsableByEnemy) continue


        return move[chosenMove].id;
    }
    return undefined;
}

//used for the frontier 
function learnPkmnMoveSeeded(id, level, mod, seed, exclude = []) {

    let attempts = 0;
    const MAX_ATTEMPTS = 100;

    const rng = seed === undefined ? Math.random : mulberry32(seed);

    while (attempts++ < MAX_ATTEMPTS) {
        const types = pkmn[id].type;
        const knownMoves = pkmn[id].movepool || [];

        let tier = 3;
        if (attempts > 10) tier = 2;
        if (attempts > 20) tier = 1;

        const allMoves = Object.keys(move).filter(m => {
            const data = move[m];
            return (
                data.rarity === tier &&
                (mod === "wild" || !knownMoves.includes(m)) &&
                !exclude.includes(m)         
            );
        });

        if (!allMoves.length) return undefined;

        const typeMatch = [];
        const movesetMatch = [];

        for (const m of allMoves) {
            const data = move[m];
            if (types.includes(data.type)) typeMatch.push(m);
            else if (types.some(t => data.moveset.includes(t)))
                movesetMatch.push(m);
        }

        const chosenList = typeMatch.length ? typeMatch : movesetMatch;
        if (!chosenList.length) continue;

        return chosenList[Math.floor(rng() * chosenList.length)];
    }

    return undefined;
}


//--Gives Pokemon appropiate abilities
function learnPkmnAbility(id,boost=1) {
    const types = pkmn[id].type;

    let tier = 1;
    if (rng(0.20*boost)) tier = 2;
    if (rng(0.06*boost)) tier = 3;

    const pool = Object.keys(ability).filter(a => {
        const ab = ability[a];
        if (ab.rarity !== tier) return false;
        if (ab.type == undefined) return false;
        if (a == pkmn[id].hiddenAbility?.id) return false
        if (a == pkmn[id].ability) return false

        return ab.type.includes("all") || ab.type.some(t => types.includes(t));
    });

    const pick = pool[Math.floor(Math.random() * pool.length)];

    return pick;
}


document.getElementById('pokedex-menu').addEventListener('scroll', function() {
  const scrolled = this.scrollTop;
  const remInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const threshold = 30 * remInPixels;
  
  const returnButton = document.getElementById('pokedex-menu-return');
  returnButton.style.opacity = scrolled >= threshold ? '0.5' : '0';
});


//--Tutorial stuff
function newGameIntro(){
  saved.tutorial = true
  document.getElementById('disclaimer-menu').style.display = "flex"
  setTimeout(() => {
    document.getElementById('disclaimer-menu').style.opacity = "0"
    document.getElementById('starter-menu').style.display = "flex"
  }, 5000);
    setTimeout(() => {
    document.getElementById('disclaimer-menu').style.display = "none"
  }, 6000);

}

saved.tutorial = false
saved.tutorialStep = "intro"




function openTutorial(){



  if (saved.tutorialStep == "none") {
    document.getElementById("tutorial").style.display = "none"
    return
  }

  if (saved.tutorialStep == "intro") document.getElementById("tutorial-text").innerHTML = `Howdy! I have been assigned to show the ropes<br>Let's start by getting new pokemon shall we? Select "Travel" on the top left menu`
  if (saved.tutorialStep == "travel") document.getElementById("tutorial-text").innerHTML = `You can right click/long tap almost everything on the screen for more info! You can also do this within the info itself too. Try going into the first Wild Area to start catching Pokemon`
  if (saved.tutorialStep == "moves") document.getElementById("tutorial-text").innerHTML = `Right click/long tap a pokemon in your team to set their moves, you can also do this while in battle. Press the + symbol next to the Pokemon to assign items<br>Once you are ready, press Save and Go! at the top of the screen`
  if (saved.tutorialStep == "battle") document.getElementById("tutorial-text").innerHTML = `Your team will automatically attack in a set pattern, even while you tab out or close the browser! You can right click/long press on moves or pokemon to see their stats as well. Once you have more Pokemon in your team, you will be able to switch them around in a fight`
  if (saved.tutorialStep == "battleEnd") {document.getElementById("tutorial-text").innerHTML = `You can check a more in-depth explanation about stats and battle mechanics in the Guide menu. For now, I will take a break... Enjoy your stay!`}
  document.getElementById("tutorial").style.display = "flex"
  
}


const guide = {}

guide.inspecting = {
  name: `Inspecting`,
  description: function() { return `Right click/long press on most elements can give further information. You can further right click/long press on information within information.<br><br>Some elements that can be inspected include areas, trainers, moves, status effects, wild pokemon, team pokemon and items`}
}

guide.stats = {
  name: `Battle: Stats`,
  description: function() { return `Each species of Pokémon share the same base stats that determine the actual stats of a Pokémon at a given level<br><br>Stats determine how much damage they deal and receive (see Battle: Moves). The speed stat determines how fast a Pokemon executes a move<br><br>Individual Values, or IV's, multiply base stats, and can be increased by getting multiple copies of Pokemon<br><br>Depending on their base stats, a Division will be asigned to them. You might use this Division letter to quickly assess which Pokemon can perform better on the short term`}
}

guide.abilities = {
  name: `Battle: Abilities`,
  description: function() { return `Abilities are traits that a Pokemon can have. While they are randomised, some abilities can only appear on specific typings. Abilities are sorted in three categories; common, uncommon and rare<br><br>Hidden abilities are innate species-dependant traits that need to be unlocked with an Ability Capsule. Once unlocked, their effect will permanently be active alongside their other ability. Same Hidden Ability and Ability wont stack with eachother`}
}

guide.experience = {
  name: `Battle: Experience`,
  description: function() { return `Pokemon gain experience by defeating foes, and share a portion of it among the team. This will also be the case even if the team Pokemon are defeated<br><br>Experience gain is proportional to the level difference. A level difference of +-5 levels will net the same amount, while more than 5 levels of difference will greatly increase the amount received.<br><br>A Pokemon 10 levels higher will not yield any experience`}
}

guide.moves = {
  name: `Battle: Moves`,
  description: function() { return `Moves are learnt every 7 levels. Moves can be switched by right click/long press on a team pokemon<br><br>Damaging moves are divided into physical and special moves<br>The category of the move determines whether the move's damage depends on the user's Attack or Special Attack stat and the target's Defense or Special Defense<br><br>Some Pokemon might have Signature Moves. Signature Moves are species-dependant moves that a Pokemon learn at level 100. Signature Moves can't be inherited through genetics, unless the host has the corresponding Egg Move<br><br>Some moves might be restricted. Only one restricted move might be equipped at a time on the active Pokemon`}
}

guide.stab = {
  name: `Battle: STAB`,
  description: function() { return `If a Pokemon uses a damaging move that has the same type as one of that Pokemon's types, the move's damage is increased by x1.5<br>This is known as same-type attack bonus, or STAB<br><br>Furthermore, Pokemon with a single typing will receive +0.2 extra STAB damage` }
}

guide.crossStab = {
  name: `Battle: Cross-Power`,
  description: function() { return `If a Pokemon uses a damaging move that is preceded (immediately or not) by a damaging move of a different type of the executed move, it will receive a 1.3x damage multiplier. This is indicated with a cross pattern on the move bar of the affected move` }
}

guide.battleFatigue = {
  name: `Battle: Battle Fatigue`,
  description: function() { return `Pokemon lose a very small fraction of their maximum health when attacking. This damage can be mitigated by a sum of the HP, Defense and Special Defense of the Pokemon, meaning bulkier Pokemon can battle for longer` }
}

guide.statusEffects = {
  name: `Battle: Status Effects`,
  description: function() { return `Certain moves inflict Status Effects such as ${tagConfused}, ${tagBurn}, ${tagPoisoned}, ${tagFreeze}, ${tagParalysis} or ${tagSleep}.<br><br>You can further check their effects by right click/long press<br><br>Status Effects, like temporal stat changes, will count down with turns. You can only apply one Status Effect at a time. They last for 3 turns by default (Except Paralysis)` }
}

guide.buffsDebuffs = {
  name: `Battle: Buffs and Debuffs`,
  description: function() { return `Like status effects, increases or decreases of stats last for 3 turns by default (Except Speed decreases, which last 2)<br><br>Buffs and debuffs of the same magnitude will not stack with each other (IE x2 50% Attack Up), but different ones will (50% + 100% Attack Up)` }
}

guide.weather = {
  name: `Battle: Weather`,
  description: function() { return `Certain moves can change the weather to altered ones such as ${tagSunny}, ${tagRainy}, ${tagSandstorm}, ${tagHail}, ${tagFoggy}, ${tagElectricTerrain}, ${tagGrassyTerrain}, ${tagMistyTerrain}, ${tagTrickRoom}, ${tagWeirdRoom}, ${tagCrossRoom}, ${tagLightScreen} or ${tagSafeguard}<br><br>You can further check their effects by right click/long press<br><br>Altered weathers will last for 15 turns, and only can be changed after 30` }
}

guide.shiny = {
  name: `Shiny Pokemon`,
  description: function() { return `At a rate of 1/400, Pokemon can be shiny. These odds can be boosted through different means<br><br>Shiny Pokemon deal 15% more damage. The visual distinction can be toggled from their move menu. This wont affect the damage bonus they get<br><br>Shiny Pokemon do not carry over their evolutions. Instead, genetics must be used.<br><br>If the stars align, a shiny pokemon can receive a star sign, an even rarer pigmentation. This does not have any practical benefit, and can't be inherited or mutated trough genetics`}
}

guide.genetics = {
  name: `Genetics: Quick Guide`,
  description: function() { return `
    Genetics allows you to modify a Pokemon beyond what is considered normal for the species, here is a quick overview of what you can achieve with operations:
    <br><br>Shiny Mutation: You can inherit the shiny mutation, with a 100% chance, to members of the same family. You can also attempt to spread a new shiny mutation by using a shiny sample
    <br><br>IV Boosting: Simply by doing any operation, regardless of the compatibility, the IV's of the host will attempt to increase. Useful for Pokemon with little to no IV's
    <br><br>IV Inheriting: An advanced alternative to the previous. You can inherit IV's from a species to another depending on factors such as compatibility or genetic-aiding items used
    <br><br>Move Relearn: When completing an operation, all but the four selected moves of the host will be reset, meaning you can attempt to get stronger moves with each operation
    <br><br>Move Inheriting: An advanced alternative to the previous, you can inherit moves from the sample that would otherwise not be available to you through learning
    <br><br>Ability Inheriting: Using a Destiny Knot, you can swap abilities with the sample, getting access to otherwise-impossible combinations
    `}
}

guide.compatibility = {
  name: `Genetics: Compatibility`,
  description: function() { return `Compatibility determines how similar the sample is to the host. This influences various parameters such as the chances of inherit, or shiny mutations (only if the sample is shiny)<br><br>Sharing one type with the sample will yield one level of compatibility, whereas sharing two types will increase it by two levels.<br><br>Additionally, if the sample is of the same evolutive line as the host, it will recieve maximum compatibility`}
}

guide.powerCost = {
  name: `Genetics: Power Cost`,
  description: function() { return `Power cost determines how taxing it is to modify the host. This influences the time to complete the operation<br><br>This is determined by the division of the host. A higher division will exponentially increase the time required to modify the Pokemon`}
}

guide.divisions = {
  name: `Divisions`,
  description: function() { return `Every Pokemon is assigned a Division letter based on their base stat total. Divisions provide a quick way to gauge a Pokemon's overall power level<br><br>The divisions from weakest to strongest are: D, C, B, A, S, SS, and SSS<br><br>Divisions affect several game mechanics:<br>• Training difficulty and matchups scale with your Pokemon's division<br>• The Battle Frontier has league restrictions based on division (Little Cup: C and below, Great League: B and below, etc.)<br>• Genetics power cost increases with higher divisions, meaning stronger Pokemon take longer to modify<br><br>While higher-division Pokemon tend to be stronger, clever team building with abilities, moves, and items can make lower-division Pokemon punch above their weight` }
}

guide.wildAreas = {
  name: `Wild Areas & Rotations`,
  description: function() { return `Wild Areas are your primary source of new Pokemon. All Pokemon encountered in Wild Areas can be caught by defeating them<br><br>Wild Areas rotate every day, so be sure to check what's available! Each area has a level range and a set of common, uncommon, and rare spawns<br><br>You can right click/long press on an area before entering to preview which Pokemon and items can be found there<br><br>The Alternate Rotation setting in Settings allows you to subtract 1 from the current rotation, useful if you missed yesterday's pool` }
}

guide.dungeons = {
  name: `Dungeons`,
  description: function() { return `Unlike Wild Areas, Pokemon in Dungeons cannot be caught. Instead, Dungeons are valuable for farming items and gaining experience<br><br>Dungeons rotate daily alongside Wild Areas. Each dungeon has its own pool of item drops, including rare finds<br><br>Dungeons are a great way to level up your team and gather resources for the Shop, Evolution, and Genetics` }
}

guide.vsTrainers = {
  name: `VS Trainers`,
  description: function() { return `VS Trainers is your main progression path. Defeat increasingly difficult trainers to earn Bottle Caps and unlock new content<br><br>You can right click/long press on a trainer to preview their team and any victory rewards before committing to a fight<br><br>Progressing through VS Trainers may unlock additional Wild Areas and features. Some trainers have field effects that modify the battle rules, so plan your team accordingly` }
}

guide.battleFrontier = {
  name: `Battle Frontier`,
  description: function() { return `The Battle Frontier houses multiple challenge modes with division restrictions that rotate every three days:<br><br>• Battle Tower: An infinitely-scaling challenge where each defeated Pokemon increases the difficulty. Your highest floor is saved per rotation. Type immunities are converted to resistances here<br><br>• Battle Factory: Deal the maximum amount of damage! You take fixed damage each turn, and status damage is disabled. Your highest score is saved per rotation<br><br>• Battle Arena: Face five trainers with selectable difficulty tiers (Level 100/125/150). Randomised field effects make each attempt unique. Higher difficulty yields more Golden Bottle Caps<br><br>Frontier trainers reset daily, so you can retry as often as you like. Each mode can award up to 100 Golden Bottle Caps per rotation` }
}

guide.trainingGuide = {
  name: `Training`,
  description: function() { return `Training allows you to improve specific aspects of your Pokemon through structured challenges:<br><br>• IV Training (★): Increase your Pokemon's Individual Values by battling waves of foes<br>• EXP Training (★★★): Gain experience faster against level-scaled opponents<br>• Signature Move Training (★★★★): Attempt to teach your Pokemon its unique signature move<br>• Ability Training (★★): Re-roll your Pokemon's ability for a potentially better one<br>• Hidden Ability Training (★★★★): Unlock your Pokemon's Hidden Ability<br><br>During training, you'll have a natural type advantage and opponents scale to your level. Type immunities are converted to resistances. Failing a training session will result in no gains` }
}

guide.itemsCurrency = {
  name: `Items & Currencies`,
  description: function() { return `There are two main currencies in the game:<br><br>• Bottle Caps: The standard currency earned from VS Trainers, used to buy most items in the Poke-Mart<br>• Golden Bottle Caps: A premium currency earned from the Battle Frontier and Arena, used for high-end purchases like TMs, Curry ingredients, and special items<br><br>Items are divided into several categories:<br>• Held Items: Equip on Pokemon for passive bonuses in battle<br>• Evolution Items: Stones and special items to evolve certain Pokemon<br>• TMs: Teach specific moves to compatible Pokemon<br>• Berries & Gems: Various consumable effects<br>• Key Items: Special progression items like the Auto-Refight Ticket<br><br>You can manage your items from the Items menu, and purchase new ones from the Poke-Mart` }
}

guide.evolution = {
  name: `Evolution`,
  description: function() { return `Pokemon can evolve in two main ways:<br><br>• Level Evolution: Many Pokemon evolve automatically when they reach a certain level<br>• Item Evolution: Some Pokemon require specific items (such as elemental stones or trade items) to evolve. These items can be purchased from the Poke-Mart or found as dungeon drops<br><br>When a Pokemon evolves, it gains new base stats and potentially new typings. Moves are retained through evolution<br><br>Important: Shiny status does not carry over through evolution. To get a shiny evolved form, you must use Genetics to pass the shiny mutation to an already-evolved Pokemon` }
}

guide.pokerus = {
  name: `Pokerus`,
  description: function() { return `Every 12 hours, some of your Pokemon will randomly contract Pokerus. Don't worry — this virus is entirely beneficial!<br><br>Pokemon with Pokerus receive an extra level of Genetic Compatibility when used as a host in Genetics operations. This makes them better candidates for IV inheritance and other genetic modifications<br><br>Pokerus is indicated on the Pokemon and can help turn otherwise low-compatibility pairings into viable genetic operations` }
}

guide.megaDimension = {
  name: `Mega Dimension`,
  description: function() { return `The Mega Dimension is the endgame challenge, housing only the most powerful Pokemon in the universe<br><br>Wormholes appear with unique rules, including:<br>• Unique field effects that modify battle mechanics<br>• Skills that trigger at specific HP thresholds during the fight<br>• Randomised boss Pokemon that change each rotation<br><br>These encounters are significantly harder than anything else in the game and are designed for fully optimised teams with strong IVs, abilities, and move coverage<br><br>Prepare thoroughly before entering a wormhole — right click/long press to preview the encounter rules` }
}

guide.events = {
  name: `Events`,
  description: function() { return `Events are special rotating areas that appear every three days, containing both collectible Pokemon and items<br><br>Events are split into tiers:<br>• Standard events: Catch unique Pokemon and gather items<br>• Boss events (marked with a skull): Powerful foes that usually require a special item to catch. The item won't be consumed if you fail to defeat the boss<br><br>Boss encounter items like Apricorns can be acquired from collection-tier events. Higher difficulty tiers may drop rarer Apricorn colours<br><br>Keep an eye on the rotation — event Pokemon may not be available through any other means!` }
}

guide.curry = {
  name: `Curry`,
  description: function() { return `Every 12 hours, you can cook a Curry at the Poke-Mart's Restaurant section. Curry provides temporary team-wide abilities during raids for 1 hour<br><br>How it works:<br>• Select up to 5 ingredients to add to the curry pot<br>• Different ingredient combinations produce different ability effects<br>• Pay the Golden Bottle Cap cost to cook<br><br>The abilities gained follow the same rules as regular abilities, and will not stack with already existing ones on your Pokemon<br><br>Curry is a powerful tool for tackling difficult content like the Mega Dimension or challenging VS Trainers` }
}

function setGuide(){

  for (const i in guide){


    const div = document.createElement("div")

    div.innerHTML = `<div>${guide[i].name}</div>`

    document.getElementById("guide-list").appendChild(div)



      div.addEventListener("click", e => {
        document.getElementById("tooltipTop").style.display = `none`
        document.getElementById("tooltipTitle").innerHTML = `${guide[i].name}`
        document.getElementById("tooltipMid").style.display = `none`
        document.getElementById("tooltipBottom").innerHTML = `<span style="overflow-y:scroll; max-height:25rem; display:inline-block;">${guide[i].description()}</span>`


        if (i === "stats") {
          document.getElementById("tooltipMid").style.display = `flex`
          document.getElementById("tooltipMid").innerHTML = `
          <div class="pkmn-stats-panel" style = "width:100%; justify-content:center; align-items:center;">
                  <div class="pkmn-stats-panel-bst">
                        <svg style="color:white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" fill-opacity="0.3" d="M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9c0 0 -7.43 -7.79 -8.24 -9c-0.48 -0.71 -0.76 -1.57 -0.76 -2.5c0 -2.49 2.01 -4.5 4.5 -4.5c1.56 0 2.87 0.84 3.74 2c0.76 1 0.76 1 0.76 1Z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c0 0 0 0 -0.76 -1c-0.88 -1.16 -2.18 -2 -3.74 -2c-2.49 0 -4.5 2.01 -4.5 4.5c0 0.93 0.28 1.79 0.76 2.5c0.81 1.21 8.24 9 8.24 9M12 8c0 0 0 0 0.76 -1c0.88 -1.16 2.18 -2 3.74 -2c2.49 0 4.5 2.01 4.5 4.5c0 0.93 -0.28 1.79 -0.76 2.5c-0.81 1.21 -8.24 9 -8.24 9"/></svg>
                        Health
                    </div>
                    <div class="pkmn-stats-panel-bst">
                        <svg style="color:white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m12 16.975l1.475-1.475H15.5v-2.025L16.975 12L15.5 10.525V8.5h-2.025L12 7.025L10.525 8.5H8.5v2.025L7.025 12L8.5 13.475V15.5h2.025zm0 6.325L8.65 20H4v-4.65L.7 12L4 8.65V4h4.65L12 .7L15.35 4H20v4.65L23.3 12L20 15.35V20h-4.65z"/></svg>
                        Attack
                    </div>
                    <div class="pkmn-stats-panel-bst">
                        <svg style="color:white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 11.991c0 5.638 4.239 8.375 6.899 9.536c.721.315 1.082.473 2.101.473V8l-9 3z"/><path fill="currentColor" d="M14.101 21.527C16.761 20.365 21 17.63 21 11.991V11l-9-3v14c1.02 0 1.38-.158 2.101-.473M8.838 2.805L8.265 3c-3.007 1.03-4.51 1.545-4.887 2.082C3 5.62 3 7.22 3 10.417V11l9-3V2c-.811 0-1.595.268-3.162.805" opacity="0.5"/><path fill="currentColor" d="m15.735 3l-.573-.195C13.595 2.268 12.812 2 12 2v6l9 3v-.583c0-3.198 0-4.797-.378-5.335c-.377-.537-1.88-1.052-4.887-2.081"/></svg>
                        Defense
                    </div>
                    <div class="pkmn-stats-panel-bst">
                        <svg style="color:white" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="currentColor" d="M306.72 22.688c-87.212.763-181.58 53.14-238.19 140.406c-.944 1.46-1.677 3.068-2.593 4.53c.455-.397.86-.917 1.313-1.31c-40.253 56.984-35.183 136.503 15.813 187.5c54.553 54.552 141.745 56.65 199.093 6.78c-4.676 6.576-9.916 13.137-15.812 19.03c-57 57-149.53 57-206.53 0c-17.814-17.81-30.103-38.73-36.783-61.312c2.928 65.605 34.97 122.74 93.907 151.97c103.593 51.374 250.2-2.8 326.875-121C510.904 245.856 502.47 127.374 429.938 65c-10.36-8.91-22.206-16.483-35.156-22.906c-25.897-12.844-54.454-19.11-83.905-19.407c-1.38-.013-2.772-.012-4.156 0zm1.06 62.406c47.14-.705 82.63 23.414 90.376 58.906v.03c1.417 6.492 1.806 13.565 1.344 21.032c-3.682 59.742-68.786 126.655-145.438 149.563c-.945.282-1.872.422-2.812.688l.938-.47c-37.843 12.718-74.086-.708-84.438-33.624c-7.03-22.36-.468-48.544 15.25-70.408c-1.695 7.2-.05 13.91 5.344 18.375c10.643 8.816 31.83 5.575 47.312-7.25c15.483-12.824 19.394-30.37 8.75-39.187c-6.294-5.214-16.287-6.21-26.594-3.5l.532-.313c-.755.257-1.52.54-2.28.813c-.344.123-.69.217-1.033.344a54 54 0 0 0-8 3.344c-.656.307-1.315.61-1.968.937c-42.374 21.24-83.226 68.335-71.656 105.125c3.616 11.497 10.213 20.614 19.094 27.094c-30.253-10.44-48.35-34.526-46.563-68.53c3.682-70.837 83.193-133.31 159.844-156.22c14.673-4.385 28.802-6.553 42-6.75z"/></svg>
                        Special Attack
                    </div>
                    <div class="pkmn-stats-panel-bst">
                        <svg style="color:white" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="currentColor" fill-rule="evenodd" d="m311.874 171.817l65.452-99.754l-.865-.367l50.206 12.144l-.221 17.259l.049 93.284l.119 25.42c.562 109.632-58.957 176.828-107.749 213.459l-11.037 7.917l-15.418 9.91l-9.239 5.345l-8.181 4.374l-12.415 5.962l-6.126 2.563l-6.403-2.682l-5.725-2.644l-7.222-3.591l-10.821-5.871l-12.434-7.468l-10.839-7.169c-48.347-33.416-112.698-97.735-117.398-205.151l-.274-12.587V84.09L256.45 42.668l22.726 5.497l-62.978 142.683l48.901 20.757l-80.615 154.048l176.882-172.827z" clip-rule="evenodd"/></svg>
                        Special Defense
                    </div>
                    <div class="pkmn-stats-panel-bst">
                        <svg style="color:white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 19v-2H5.675q-.5 0-.7-.45t.125-.8l6.15-6.9q.3-.35.75-.35t.75.35l6.15 6.9q.325.35.125.8t-.7.45H15v2q0 .425-.288.713T14 20h-4q-.425 0-.712-.288T9 19m3-13l-5.025 5.675q-.15.15-.35.238t-.4.087q-.65 0-.912-.575t.162-1.075l5.775-6.5q.3-.35.75-.35t.75.35l5.775 6.5q.425.5.163 1.075t-.913.575q-.2 0-.4-.075t-.35-.25z"/></svg>
                        Speed
                    </div>
                </div>
                    `
        }


        openTooltip()
      })


  }

}setGuide()


function info() {
  console.info("Type a command for further info");
  console.table([
    {command:"infoPkmn()", info:"Modify Pokemon"},
    {command:"infoItem()", info:"Modify Items"},
    {command:"infoRotation()", info:"Modify Rotations"},
    {command:"infoMisc()", info:"Miscellaneous Commands"},

  ]);

}

function infoPkmn(){
    console.table([
      {command:"givePkmn(pkmn.NAME, LEVEL)", effect:"Give Pokemon"},
      {command:"pkmn.NAME.level=LEVEL", effect:"Modify Pokemon level"},
      {command:"pkmn.NAME.shiny=true", effect:"Modify Pokemon shiny status"},
      {command:"pkmn.NAME.ivs.hp=NUMBER", effect:"Modify Pokemon ivs (hp, atk, satk, def, sdef, spe)"},
      {command:"pkmn.NAME.movepool.push(move.NAME.id)", effect:"Add Pokemon Move"},
      {command:"pkmn.NAME.ability=ability.NAME.id", effect:"Modify Pokemon Ability"},
      {command:"pkmn.NAME.hiddenAbilityUnlocked=true", effect:"Unlock Hidden Ability"},
      ]);
}

function infoItem(){
    console.table([
      {command:"item.NAME.got=AMOUNT", effect:"Give Items"},
      ]);
}

function infoRotation(){
    console.table([
      {command:"rotationWildCurrent=NUMBER", effect:"Modify Wild Rotation"},
      {command:"rotationDungeonCurrent=NUMBER", effect:"Modify Dungeon Rotation"},
      {command:"rotationEventCurrent=NUMBER", effect:"Modify Event Rotation"},
      {command:"rotationFrontierCurrent=NUMBER", effect:"Modify Frontier Rotation"},
      ]);
}

function infoMisc(){
    console.table([
      {command:"saved.overrideBattleTimer=NUMBER", effect:"Alter Battle Speed (Default 2000)"},
      {command:"debugGetPkmn(LEVEL,'shiny')", effect:"Get all Pokemon at certain level. Shiny is optional"},
      {command:"debugSetIvs(NUMBER)", effect:"Set all Pokemon IV's. Maximum 6"},
      {command:"debugGetItems()", effect:"Get 999 of all items"},
      {command:"saved.geneticOperation=1", effect:"Complete Genetics Operation"},
      {command:"getMoveset(pkmn.NAME,LEVEL)", effect:"Generates a table of possible Pokemon moves"},
      ]);
}



  saved.gamemodNuzlocke = false
  saved.gamemodHard = false
  saved.gamemodAfk = false
  saved.gamemodIvs = false


//--Game modifier mappings: [savedKey, checkboxId]
const gameModifiers = [
  ['gamemodAfk',      'checkbox-mode-afk'],
  ['gamemodHard',     'checkbox-mode-hard'],
  ['gamemodNuzlocke', 'checkbox-mode-nuzloke'],
  ['gamemodIvs',      'checkbox-mode-ivs'],
];

//fixes visual bugs of settings, thanks html very cool
function updateSettings(alt){

  document.getElementById("settings-theme").value = saved.theme

  document.getElementById("settings-hide-got").value = saved.hideGotPkmn == "true" ? "true" : "false"
  document.getElementById("settings-alternate-rotation").value = saved.alternateWildRotation == "true" ? "true" : "false"

  if (document.getElementById("tooltip-modifiers-list")) {
    for (const [key, id] of gameModifiers) {
      const el = document.getElementById(id);
      if (alt != true) { el.checked = saved[key] == true; }
      if (alt == true) { saved[key] = el.checked; }
    }
  }

}