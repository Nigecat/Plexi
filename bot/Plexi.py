import discord
import requests
from config import *
from requests import get
from bs4 import BeautifulSoup
from discord.utils import get
from discord.utils import find
from discord.ext import commands

TOKEN = 'NjIxMTc5Mjg5NDkxOTk2Njgz.XXhmFw.IgagFyMii9zzY8gRAZBTPHxTkDU'
PREFIX = "$"
bot = commands.Bot(command_prefix = PREFIX)

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

    game = PREFIX + "help"
    activity = discord.Game(name = game)
    await bot.change_presence(status=discord.Status.online, activity=activity)

@bot.event
async def on_message(message):
    await bot.process_commands(message) #Send the command to the rest of the script

#COMMANDS -------------------------------------------------------

@bot.command()
async def define(ctx, *, word):
    async with ctx.typing():
        try:
            data = []

            url = "https://www.merriam-webster.com/dictionary/" + word
            page = requests.get(url)
            soup = BeautifulSoup(page.content, 'html.parser')

            definitions = soup.find_all(class_="vg")[0].get_text()

            definitions = definitions.split("\n")

            numbers = list("0123456789")
            for i in range(len(definitions)):
                for x in numbers:
                    if x in definitions[i]:
                        definitions[i] = ""

            while "" in definitions:
                definitions.remove("")

            tmp = "`" + word + "`"
            data.append(tmp)

            for i in definitions:
                data.append(i)
            data = "\n".join(data)
            await ctx.send(data)
        except:
            text = "`" + word + "` could not be found"
            await ctx.send(text)

@bot.command()
async def suggest(ctx, *, msg):
    msg = "Suggestion from `{}`: {}".format(ctx.author, msg)
    user = bot.get_user(307429254017056769)
    await user.send(msg)
    await ctx.send("Suggestion recieved!")

@bot.command()
async def sndmsg(ctx, *, msg):
    await ctx.message.delete()
    await ctx.send(msg)

#ADMIN COMMANDS -------------------------------------------------

@bot.command()
async def config(ctx, option, setting):
    id = ctx.message.guild.id
    if not exists(id):
        create(id)
        data = {}
    else:
        data = load(id)
    data[option] = setting
    save(id, data)

#----------------------------------------------------------------

bot.remove_command('help')

@bot.command()
async def help(ctx, *, command = None):
    if command == None:
        public = discord.Embed(title = "Plexi", description = "If you have any requests/suggestions for commands, use $suggest [TEXT]", color=0xeee657)
        public.add_field(name = "$define [word]", value = "Define a word", inline=False)
        public.add_field(name = "$randomfact", value = "Displays a random fact", inline=False)
        public.add_field(name = "$suggest", value = "Suggest a command", inline=False)

        private = discord.Embed(title = "Plexi", description = "If you have any requests/suggestions for commands, use $suggest [TEXT]", color=0xeee657)
        private.add_field(name = "$config [arg] [state]", value= "Configure the bot", inline=False)

        user = bot.get_user(ctx.message.author.id)
        await user.send(embed = private)

        await ctx.send(embed = public)
         
bot.run(TOKEN)