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
function playGame(index){
  console.log("Play clicked", index);

  const game = gamesData[index];

  document.getElementById("player").style.display = "block";
  document.getElementById("frame").src = "https://itch.io/embed/182406";
}
window.playGame = playGame;

const gamesData = [
  {
    title: "Friday Night Funkin",
    category: "rpg",
    thumb: "https://img.itch.zone/aW1nLzQyOTY1NDYucG5n/original/8Q%2B6FZ.png",
    url: "https://itch.io/embed/622466",
    type: "embed"
  },
  {
    title: "Among Us (Fan Version)",
    category: "strategy",
    thumb: "https://img.itch.zone/aW1nLzM0Njk1NjkucG5n/original/abc.png",
    url: "https://itch.io/embed/524904",
    type: "embed"
  },
  {
    title: "Super Platformer",
    category: "shooter",
    thumb: "https://picsum.photos/400/200?random=5",
    url: "https://itch.io/embed/1031090",
    type: "embed"
  },
  {
    title: "2048 Game",
    category: "strategy",
    thumb: "https://picsum.photos/400/200?random=1",
    url: "https://play2048.co/",
    type: "embed"
  },
  {
    title: "Tetris",
    category: "strategy",
    thumb: "https://picsum.photos/400/200?random=2",
    url: "https://tetris.com/play-tetris",
    type: "external"
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
    <button class="btn" onclick="playGame(0)">▶ Play</button>
      <button class="btn" onclick="toggleFav(${JSON.stringify(game)})">⭐ Fav</button>
    `;
    grid.appendChild(card);
  });
}

// Init
renderGames();
