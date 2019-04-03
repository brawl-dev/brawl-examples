const axios = require("axios");
const WebSocket = require("ws");
require("dotenv").config();

async function start(url) {
  let others;
  if (!url) {
    try {
      ({
        data: { url, others }
      } = await axios.post("https://brawl.dev/api/games", {
        id: process.env.BRAWL_ID,
        secret: process.env.BRAWL_SECRET,

        numPlayers: 30,
        numEasyBots: 0,
        numMediumBots: 0,
        numHardBots: 0
      }));
    } catch (e) {
      console.log(e);
      return;
    }
  }
  console.log(url);
  const ws = new WebSocket(url);
  ws.on("open", function() {
    console.log("connected!");
  });
  ws.on("message", function(data) {
    const { ring, players, me } = JSON.parse(data);
    console.log(
      `--${me} Ticks Left: ${ring.ticksLeft} Ring: (${ring.position.x}, ${
        ring.position.y
      }) Radius: ${ring.radius}--`
    );
    players.forEach((player, index) => {
      if (player.alive)
        console.log(`${index} (${player.position.x}, ${player.position.y})`);
    });

    const x = ring.position.x - players[me].position.x;
    const y = ring.position.y - players[me].position.y;

    const d = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    const p = angle - players[0].rotation;

    ws.send(
      JSON.stringify({
        thrust: 0.00002 * d * ring.radius,
        torque: p * 0.1
      })
    );
  });
  ws.on("close", function() {
    console.log("close");
  });

  return others;
}

start();
