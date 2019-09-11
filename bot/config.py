from json import dump
from json import load as read

def save(id, data):
    file = ".\\config\\{}.json".format(id)
    with open(file, "w") as f:
        dump(data, f, indent = 4)

def load(id):
    file = ".\\config\\{}.json".format(id)
    with open(file) as f:
        data = read(f)   
    return data