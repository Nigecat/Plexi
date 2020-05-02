from re import sub
from os import system
from pathlib import Path
from requests import get
from string import capwords

def downloadImage(name, set, url):
    Path(f"src/commands/resources/catrd/{set}").mkdir(parents = True, exist_ok = True)
    filename = f"src/commands/resources/catrd/{set}/{name.replace(' ' , '_')}.jpg"
    r = get(url)
    with open(filename, "wb") as f:
        f.write(r.content)

def uppercase(matchobj):
    return matchobj.group(0).upper()

def capitalize(s):
    return sub(r'^([a-z])|[\.|\?|\!]\s*([a-z])|\s+([a-z])(?=\.)', uppercase, s).replace(" i ", " I ")

cards = []
while True:
    system("cls")
    print(*cards, sep = "\n")
    print()

    url = input("Image url: ")
    name = capwords(input("Card name: ").lower())
    rarity = input("Card rarity (number from 0-100): ")
    type = input("Card type [melee, scout, defense]: ").lower()
    power = input("Card power: ")
    set = capwords(input("Set name: ").lower())
    ability = capwords(input("Ability name (press enter for no ability): ").lower())

    downloadImage(name, set, url)
    cards.append(f"INSERT OR IGNORE INTO Sets ( set_name ) VALUES ( '{set}' );")

    if ability == "":
        cards.append(f"INSERT INTO Card ( name, rarity, type, power, set_name ) VALUES ( '{name}', '{rarity}', '{type}', '{power}', '{set}' );")

    else:
        cards.append(f"INSERT OR IGNORE INTO Ability ( ability_name ) VALUES ( '{ability}' );")
        cards.append(f"INSERT INTO Card ( name, rarity, type, power, set_name, ability_name ) VALUES ( '{name}', '{rarity}', '{type}', '{power}', '{set}', '{ability}' );")
        