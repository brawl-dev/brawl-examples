from websocket import create_connection
import websocket
import requests
import json

r = requests.post('http://localhost:8080/', data={})
data = r.json()

ws = create_connection(data['url'])

while True:
    try:
        data = json.loads(ws.recv())
    except:
        break
    print(
        "---Ticks Left: {ticksLeft}  Ring: ({position[x]}, {position[y]}) Radius: {radius}---".format(**data['ring']))
    for (index, player) in enumerate(data['players']):
        print("{0}  ({position[x]}, {position[y]})".format(
            index if player['alive'] else 'X', **player))
    ws.send(json.dumps({"thrust": 0, "torque": 0}))

ws.close()
