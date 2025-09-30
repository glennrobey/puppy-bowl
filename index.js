const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "2803-PUPPIES";
const API = `${BASE}/${COHORT}`;
const PLAYERS_URL = `${API}/players`;

const state = {
  players: [],
  selectedPlayer: null,
};

async function fetchPlayers() {
  try {
    const res = await fetch(PLAYERS_URL);
    const data = await res.json();
    state.players = data.data.players;
    renderRoster();
  } catch (err) {
    console.error(err);
  }
}

function renderRoster() {
  const rosterEl = document.getElementById("roster-list");
  rosterEl.innerHTML = ""; // clear previous content

  state.players.forEach((player) => {
    const div = document.createElement("div");
    div.className = "player-card"; // optional styling class
    div.innerHTML = `
      <h3>${player.name}</h3>
      <img src="${player.imageUrl}" alt="${player.name}" />
    `;

    div.addEventListener("click", () => selectPlayer(player.id));
    rosterEl.appendChild(div);
  });
}

async function selectPlayer(id) {
  try {
    const res = await fetch(`${API}/players/${id}`);
    const data = await res.json();
    state.selectedPlayer = data.data.player;
    renderSelectedPlayer();
  } catch (err) {
    console.error(err);
  }
}
