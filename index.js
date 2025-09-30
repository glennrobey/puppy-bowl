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

function renderSelectedPlayer() {
  const detailEl = document.getElementById("selected-player");
  const player = state.selectedPlayer;

  if (!player) {
    detailEl.innerHTML = "<p>Please select a player for details.</p>";
    return;
  }

  detailEl.innerHTML = `
<h2>${player.name}</h2>
<p>ID: ${player.id}</p>
<p>Breed: ${player.breed}</p>
<p>Status: ${player.status}</p>
<img src="${player.imageUrl}" alt="${player.name}" />
<button id="remove-btn">Remove from roster</button>
`;

  document.getElementById("remove-btn").addEventListener("click", removePlayer);
}

async function removePlayer() {
  if (!state.selectedPlayer) return;

  try {
    await fetch(`${API}/players/${state.selectedPlayer.id}`, {
      method: "DELETE",
    });

    state.selectedPlayer = null;
    fetchPlayers();
    renderSelectedPlayer();
  } catch (err) {
    console.error(err);
  }
}

document
  .getElementById("add-player-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const breed = e.target.breed.value;
    try {
      await fetch(PLAYERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, breed }),
      });
      e.target.reset();
      fetchPlayers();
    } catch (err) {
      console.error(err);
    }
  });
