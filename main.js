import { auth, provider, signInWithPopup, db, doc, getDoc, setDoc } from "./firebaseConfig.js";

let currentUser = null;

// Search + Filters
function searchGames(){
  let value = document.getElementById("search").value.toLowerCase();
  document.querySelectorAll(".card").forEach(card=>{
    card.style.display = card.innerText.toLowerCase().includes(value) ? "block":"none";
  });
}
window.searchGames = searchGames;

function filterGames(cat){
  document.querySelectorAll(".card").forEach(card=>{
    card.style.display = cat === "all" || card.dataset.category === cat ? "block":"none";
  });
}
window.filterGames = filterGames;

// Theme Toggle
function toggleTheme(){
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}
window.toggleTheme = toggleTheme;

// Firebase Login
async function authWithGoogle(){
  const result = await signInWithPopup(auth, provider);
  currentUser = result.user;
  document.getElementById("authBtn").innerText = currentUser.displayName;
  loadFavoritesFromDB();
}
window.authWithGoogle = authWithGoogle;

// Load favorites
let favorites = [];

async function loadFavoritesFromDB(){
  if(!currentUser) return;
  const favDoc = await getDoc(doc(db, "favorites", currentUser.uid));
  favorites = favDoc.exists() ? favDoc.data().games : [];
  renderGames();
}

// Toggle favorite
async function toggleFav(game){
  if(!currentUser) { alert("Login first!"); return; }
  if(favorites.includes(game.title)){
    favorites = favorites.filter(g=>g!==game.title);
  } else {
    favorites.push(game.title);
  }
  await setDoc(doc(db, "favorites", currentUser.uid), {games:favorites});
  renderGames();
}

// Fullscreen play
function playGame(url){
  window.open(url, "_blank");
}
window.playGame = playGame;

//function closePlayer(){
  document.getElementById("player").style.display="none";
  document.getElementById("frame").src="";
}
//window.closePlayer = closePlayer;

const gamesData = [
  {
    title: "Warframe",
    category: "shooter",
    thumb: "https://www.freetogame.com/g/1/thumbnail.jpg",
    url: "https://www.freetogame.com/open/warframe"
  },
  {
    title: "Forge of Empires",
    category: "strategy",
    thumb: "https://www.freetogame.com/g/2/thumbnail.jpg",
    url: "https://www.freetogame.com/open/forge-of-empires"
  },
  {
    title: "Runescape",
    category: "rpg",
    thumb: "https://www.freetogame.com/g/3/thumbnail.jpg",
    url: "https://www.freetogame.com/open/runescape"
  },
  {
    title: "Crossout",
    category: "shooter",
    thumb: "https://www.freetogame.com/g/4/thumbnail.jpg",
    url: "https://www.freetogame.com/open/crossout"
  },
  {
    title: "Albion Online",
    category: "rpg",
    thumb: "https://www.freetogame.com/g/5/thumbnail.jpg",
    url: "https://www.freetogame.com/open/albion-online"
  },
  {
    title: "World of Tanks",
    category: "strategy",
    thumb: "https://www.freetogame.com/g/6/thumbnail.jpg",
    url: "https://www.freetogame.com/open/world-of-tanks"
  }
];

// Render sections


function renderGames(){
  console.log("Rendering local games...");

  const trending = gamesData.slice(0, 3);
  const newGames = gamesData.slice(3);

  renderSection("Trending Games", trending);
  renderSection("New Games", newGames);
  renderSection("All Games", gamesData);

}
function renderSection(title, games){
  let container;

  if(title === "Trending Games"){
    container = document.getElementById("trendingSection");
  } else if(title === "New Games"){
    container = document.getElementById("newSection");
  } else {
    container = document.getElementById("gameGrid");
  }

  container.innerHTML = `<h2>${title}</h2><div class="grid"></div>`;
  const grid = container.querySelector(".grid");

  games.forEach(game=>{
    const card = document.createElement("div");
    card.className="card";
    card.dataset.category=game.category;
    const isFav = favorites.includes(game.title)? "⭐":""; 

    card.innerHTML = `
      <img src="${game.thumb}">
      <span class="category">${game.category}</span>
      <h3>${game.title} ${isFav}</h3>
      <button class="btn" onclick="playGame('${game.url}')">▶ Play</button>
      <button class="btn" onclick="toggleFav(${JSON.stringify(game)})">⭐ Fav</button>
    `;
    grid.appendChild(card);
  });
}

// Init
renderGames();
