from os import path
from json import dump
from json import load as read

def exists(id):
    return path.exists(".\\config\\{}.json".format(id))

def create(id):
    file = ".\\config\\{}.json".format(id)
    f = open(file, "w+")
    f.close()

def save(id, data):
    file = ".\\config\\{}.json".format(id)
    with open(file, "w") as f:
        dump(data, f, indent = 4)

def load(id):
    file = ".\\config\\{}.json".format(id)
    with open(file) as f:
        data = read(f)   
    return data