
def getResponse(text):
    with open("data.txt", "r") as f:
        data = f.read()
    data = data.split("\n")
    for i in range(0, len(data), 2):
        if text.lower() in data[i].lower():
            if "@" not in data[i]:
                return data[i + 1]

    return None