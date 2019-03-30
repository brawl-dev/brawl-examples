const axios = require("axios");
const WebSocket = require("ws");

async function start() {
  const {
    data: { url }
  } = await axios.post("http://localhost:8080", {});

  const ws = new WebSocket(url);
  ws.on("open", function() {
    console.log("connected!");
  });
  ws.on("message", function(data) {
    const { ring, players, me } = JSON.parse(data);
    console.log(
      `--Ticks Left: ${ring.ticksLeft} Ring: (${ring.position.x}, ${
        ring.position.y
      }) Radius: ${ring.radius}--`
    );
    players.forEach((player, index) => {
      console.log(
        `${player.alive ? index : "X"} (${player.position.x}, ${
          player.position.y
        })`
      );
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
}

start();
