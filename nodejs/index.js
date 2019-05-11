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
        league: process.env.BRAWL_LEAGUE
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
      `--${me} Ticks: ${ring.ticks} Ring: (${ring.pos.x}, ${
        ring.pos.y
      }) Radius: ${ring.radius}--`
    );
    players.forEach((player, index) => {
      if (player.alive)
        console.log(`${index} (${player.pos.x}, ${player.pos.y})`);
    });

    const x = ring.pos.x - players[me].pos.x;
    const y = ring.pos.y - players[me].pos.y;

    const d = Math.sqrt(x * x + y * y);
    const angle = Math.atan2(y, x);
    const p = angle - players[0].rot;

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

  return others || [];
}

start();
start();
start();
start();
