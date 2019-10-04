from json import load as read
from json import dump as write

def load(file):
    with open(file, 'r') as f:
        data = read(f)
    return data

def dump(file, data):
    with open(file, 'w') as f:
        write(data, f, indent = 4)

def update(file, data):
    dump(file, {**load(file), **data})