import discord   
import asyncio
from discord.ext import commands
from os import path
from json import dump
from datetime import timedelta

PREFIX = "wt"

bot = commands.Bot(command_prefix=PREFIX, self_bot=True)

@bot.event
async def on_ready():
    print("Logged in as %s#%s" % (bot.user.name, bot.user.discriminator))
    print("ID: " + str(bot.user.id))
    

@bot.event
async def on_message(msg):
    await bot.process_commands(msg)

def ascii_encode(unicode_string):
     for i in range(0, len(unicode_string)):
         try:
            unicode_string[i].encode("ascii")
         except:
            unicode_string = unicode_string.replace(unicode_string[i], " ")
     return unicode_string

@bot.command()
async def f(ctx):
    messages = await ctx.channel.history(limit = 10000).flatten()

    messages.reverse()

    obj = [{
        "author": {
            "name": f"{ascii_encode(message.author.name)}#{message.author.discriminator}", 
            "id": message.author.id, 
        },
        "message": {
            "id": message.id, 
            "content": ascii_encode(message.content), 
            "date": (message.created_at + timedelta(hours=10)).strftime('%d/%m/%Y @ %H:%M:%S')
        }
    } for message in messages]
    
    with open('data.json', 'w') as f:
        dump(obj, f, indent = 4)

    messages = [f"{ascii_encode(message.author.name)}#{message.author.discriminator}: {ascii_encode(message.content)}" for message in messages]

    messages = "\n----------\n".join(messages)

    with open("data.txt", "a+") as f:
        f.write(messages)




# Testing if file 'token.txt' exists. If it is so, then the token
# will be read out of this file. If not, the user will be asked
# for the token in the console to enter, wich will be saved in this
# file after and the bot will log in
if path.isfile("token.txt"):
    with open("token.txt") as f:
        token = f.readline()
    print("[INFO] Starting up and logging in...")
    bot.run(token, bot=False)
else:
    print("Please enter your discord account token (bot a bot account token!):")
    token = input()
    print("[INFO] Saving token...")
    with open("token.txt", "w") as f:
        f.write(token)
    print("[INFO] Starting up and logging in...")
    bot.run(token, bot=False)