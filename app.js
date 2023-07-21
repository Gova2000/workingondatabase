const express = require("express");
const sqlite3 = require("sqlite3");

const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const InitializerDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB ERROR ${e.message}`);
    process.exit(1);
  }
};
InitializerDBAndServer();

//API To Get all players
app.get("/players/", async (request, response) => {
  const getAllPlayers = `
    SELECT
    *
    FROM 
    cricket_team
    ORDER BY
    player_id`;
  const PlayerList = await db.all(getAllPlayers);
  response.send(PlayerList);
});

//API to create a new player
app.post("/players/", async (request, response) => {
  const details = request.body;
  const { player_name, jersey_number, role } = details;
  const addPlayer = `
    INSERT INTO
    cricket_team(player_name,jersey_number,role)
    VALUES
    (
        '${player_name}',
        ${jersey_number},
        '${role}'
        );`;
  await db.run(addPlayer);
  response.send("Player Added to Team");
});

//API to return a player based on playerID
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const Player = `
    SELECT 
    * 
    FROM
    cricket_team
    WHERE 
    player_id=${playerId};`;
  const bd = await db.get(Player);
  response.send(bd);
});

//Update player details
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const details = request.body;
  const { player_name, jersey_number, role } = details;
  const updatePlayer = `
    UPDATE
    cricket_team
    SET
    
        player_name='${player_name}',
       jersey_number= ${jersey_number},
        role='${role}'
    WHERE
        player_id=${playerId}
        `;
  await db.run(updatePlayer);
  response.send("Player Details Updated");
});

//DEL a player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const delPlayer = `
    DELETE FROM 
        cricket_team
    WHERE 
        player_id=${playerId};`;
  await db.run(delPlayer);
  response.send("Player Removed");
});
