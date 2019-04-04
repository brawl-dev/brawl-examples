import websocket
import requests
import json
import os
import dotenv

dotenv.load_dotenv()

r = requests.post('https://brawl.dev/api/games', json={
    'id': os.getenv("BRAWL_ID"),
    'secret': os.getenv("BRAWL_SECRET"),
    'numEasyBots': 3
})
data = r.json()

ws = websocket.create_connection(data['url'])

while True:
    try:
        data = json.loads(ws.recv())
    except:
        break
    print(
        "---Ticks Left: {ticks}  Ring: ({pos[x]}, {pos[y]}) Radius: {radius}---".format(**data['ring']))
    for (index, player) in enumerate(data['players']):
        if player['alive']:
            print("{0}  ({pos[x]}, {pos[y]})".format(
                index, **player))
    ws.send(json.dumps({"thrust": 0, "torque": 0}))

ws.close()
