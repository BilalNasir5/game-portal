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
  document.getElementById("player").style.display = "block";
  document.getElementById("frame").src = url;
}
window.playGame = playGame;

function closePlayer(){
  document.getElementById("player").style.display="none";
  document.getElementById("frame").src="";
}
window.closePlayer = closePlayer;

// Dynamic games from API
async function getDynamicGames(){
  try {
    const res = await fetch("https://www.freetogame.com/api/games");
    const games = await res.json();
    return games.slice(0, 20).map(g => ({
      title: g.title,
      category: g.genre.toLowerCase(),
      thumb: g.thumbnail,
      url: g.game_url
    }));
  } catch (e) {
    console.error("API Error:", e);
    return [];
  }
}

// Render sections
async function renderGames(){
  const dynamicGames = await getDynamicGames();

  // Trending + New
  const trending = dynamicGames.slice(0,5);
  const newGames = dynamicGames.slice(-5);

  renderSection("Trending Games", trending);
  renderSection("New Games", newGames);
  renderSection("All Games", dynamicGames, true);
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

    const isFav = favorites.includes(game.title) ? "⭐":""; 

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
