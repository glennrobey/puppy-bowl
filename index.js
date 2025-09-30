const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "2803-GLENN";
const API = `${BASE}/${COHORT}`;
const PLAYERS_URL = `${API}/players`;

const state = {
  players: [],
  selectedPlayer: null,
};

const app = document.getElementById("app");

const rosterTitle = document.createElement("h1");
rosterTitle.textContent = "Player Roster";
app.appendChild(rosterTitle);

const rosterList = document.createElement("div");
rosterList.id = "roster-list";
app.appendChild(rosterList);

const selectedTitle = document.createElement("h2");
selectedTitle.textContent = "Selected Player";
app.appendChild(selectedTitle);

const selectedPlayerDiv = document.createElement("div");
selectedPlayerDiv.id = "selected-player";
selectedPlayerDiv.innerHTML = "<p>Please select a player.</p>";
app.appendChild(selectedPlayerDiv);

const addTitle = document.createElement("h2");
addTitle.textContent = "Add Player";
app.appendChild(addTitle);

const form = document.createElement("form");
form.id = "add-player-form";

const nameInput = document.createElement("input");
nameInput.type = "text";
nameInput.name = "name";
nameInput.placeholder = "Player Name";
nameInput.required = true;

const breedInput = document.createElement("input");
breedInput.type = "text";
breedInput.name = "breed";
breedInput.placeholder = "Breed";
breedInput.required = true;

const submitButton = document.createElement("button");
submitButton.type = "submit";
submitButton.textContent = "Add Player";

form.appendChild(nameInput);
form.appendChild(breedInput);
form.appendChild(submitButton);
app.appendChild(form);

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

fetchPlayers();

function renderRoster() {
  const rosterEl = document.getElementById("roster-list");
  rosterEl.innerHTML = "";

  state.players.forEach((player) => {
    const div = document.createElement("div");
    div.className = "player-card";
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
<p>Team: ${player.team?.name || "Unassigned"}</p>
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
