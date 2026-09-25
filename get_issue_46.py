import json
import urllib.request

url = "https://api.github.com/repos/chintu79/promptocalypse/issues/46"
req = urllib.request.Request(url)
with urllib.request.urlopen(req) as response:
    data = json.loads(response.read().decode())
    print(data['body'])
