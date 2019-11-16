from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

def getResponse(text):
    #with open("data.txt", "r") as f:
    #    data = f.read()
    #data = data.split("\n")
    #for i in range(0, len(data), 2):
    #    if data[i].lower() in text.lower():
    #        if "@" not in data[i]:
    #            try:
    #                return data[i + 1]
    #            except: continue

    #return None

    chatbot = ChatBot('Ron Obvious')

    # Create a new trainer for the chatbot
    trainer = ChatterBotCorpusTrainer(chatbot)

    # Train the chatbot based on the english corpus
    trainer.train("chatterbot.corpus.english")

    # Get a response to an input statement
    return chatbot.get_response(text)