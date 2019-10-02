import nacl
import pafy
import ffmpeg
import discord
import asyncio
import youtube_dl

from time import sleep
from requests import get
from bs4 import BeautifulSoup
from os import system, remove
from discord.utils import get
from discord.utils import find
from discord.ext import commands

TOKEN = 'NjIxMTc5Mjg5NDkxOTk2Njgz.XXhmFw.IgagFyMii9zzY8gRAZBTPHxTkDU'
PREFIX = "$"
WHITELIST = [307429254017056769, 408521712725000199]
bot = commands.Bot(command_prefix = PREFIX)

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

@bot.event
async def on_message(message):
    #if "nitroflex" in message.content:
    #    nitroflex = [emoji for emoji in message.guild.emojis if "nitroflex" in emoji.name]
    #    for emoji in nitroflex:
    #        await message.add_reaction(emoji)

    if message.author.id in WHITELIST:
        await bot.process_commands(message) 

@bot.command()
async def define(ctx, *, word):
    async with ctx.typing():
        try:
            data = []

            url = "https://www.merriam-webster.com/dictionary/" + word
            page = get(url)
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
            text = "The word `" + word + "` could not be found, this does not mean that it does not exist..."
            await ctx.send(text)

@bot.command()
async def flex(ctx, level = 0):
    if level != 0:
        await ctx.message.delete()
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nitroflex" in emoji.name][:level]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)
    else:
        await ctx.message.delete()
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nitroflex" in emoji.name]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)

@bot.command()
async def nigelflex(ctx, level = 0):
    if level != 0:
        await ctx.message.delete()
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nigelflex" in emoji.name][:level]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)
    else:
        await ctx.message.delete()
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nigelflex" in emoji.name]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)

@bot.command()
async def nitrowhisper(ctx):
    await ctx.message.delete()

@bot.command()
async def nitrobroadcast(ctx):
    await ctx.message.delete()

@bot.command()
async def connect(ctx):
    try:
        channel = ctx.author.voice.channel
    except AttributeError:
        await ctx.send("You are not connected to a voice channel!")
        return

    await ctx.message.delete()
    await channel.connect()    

@bot.command()
async def disconnect(ctx):
    await ctx.message.delete()

    server = ctx.message.guild.voice_client
    await server.disconnect()

@bot.command()
async def lonely(ctx):
    try:
        channel = ctx.author.voice.channel
    except AttributeError:
        await ctx.send("You are not connected to a voice channel!")
        return

    msg = "You must be lonely, {}. I have been summoned and shall join you!".format(ctx.author.mention)
    await bot.get_channel(ctx.channel.id).send(msg)

    await channel.connect()

    voice = get(bot.voice_clients, guild = ctx.guild)
    if voice and voice.is_connected():
        await voice.move_to(channel)
    else:
        voice = await channel.connect()
    source = discord.FFmpegPCMAudio('Shrekophone.mp3')
    player = voice.play(source)

@bot.command()
async def play(ctx, url):
    try:
        channel = ctx.author.voice.channel
    except AttributeError:
        await ctx.send("You are not connected to a voice channel!")
        return

    msgchannel = bot.get_channel(ctx.channel.id)
    update = await msgchannel.send("Processing...")

    ydl_opts = {
        'outtmpl': 'Youtube\\{}.mp3'.format(url.split("=")[-1]),
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    await update.delete()

    await channel.connect()

    voice = get(bot.voice_clients, guild = ctx.guild)
    if voice and voice.is_connected():
        await voice.move_to(channel)
    else:
        voice = await channel.connect()
    source = discord.FFmpegPCMAudio('Youtube\\{}.mp3'.format(url.split("=")[-1]))
    player = voice.play(source)

@bot.command()
async def download(ctx, url):
    msgchannel = bot.get_channel(ctx.channel.id)
    update = await msgchannel.send("Downloading...")

    ydl_opts = {
        'outtmpl': 'Youtube\\{}.mp3'.format(url.split("=")[-1]),
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    await ctx.send(file=discord.File('Youtube\\{}.mp3'.format(url.split("=")[-1])))

    await update.delete()
    sleep(1)
    remove("Youtube\\{}.mp3".format(url.split("=")[-1]))

bot.remove_command("help")

@bot.command()
async def help(ctx):
    embed = discord.Embed(title="Help!", description="Plexi Commands", color=0x00ff00)
    embed.add_field(name="$help", value="Display this page", inline=False)
    embed.add_field(name="$download <url>", value="Download a youtube video and upload the mp3 file (only works if under upload cap)", inline=False)
    embed.add_field(name="$play <url>", value="Plays a youtube video into the voice channel the user is in", inline=False)
    embed.add_field(name="$lonely", value="Run if you're lonely!", inline=False)
    embed.add_field(name="$define <word>", value="Define a word, pulls from the dictionary", inline=False)
    embed.add_field(name="$connect", value="Connect the bot to the user's voice channel", inline=False)
    embed.add_field(name="$disconnect", value="Disconnect the bot from it's voice channel", inline=False)
    embed.add_field(name="$flex <level>", value="Flex on the previous message, leave level blank for max flex", inline=False)
    embed.add_field(name="$nigelflex", value="...", inline=False)

    embed.add_field(name="-------------------------------------", value="Work in progress:", inline=False)

    embed.add_field(name="$nitrowhisper", value="...", inline=False)
    embed.add_field(name="$nitrobroadcast", value="...", inline=False)

    await ctx.author.send(embed = embed)

bot.run(TOKEN)
