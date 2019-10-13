import nacl
import pafy
import ffmpeg
import discord
import asyncio
import youtube_dl

from time import sleep
from requests import get
from json_parser import *                         #local import from json_parser.py
from os import listdir, path
from threading import Thread
from bs4 import BeautifulSoup
from os import system, remove
from discord.utils import get
from pafy import new as video
from discord.utils import find
from discord.ext import commands
from random import randint, choice
from discord.ext.commands import has_permissions, MissingPermissions

def starts(msg, checks):
    for item in checks:
        if msg.startswith(item):
            return True
    return False

TOKEN = 'NjIxMTc5Mjg5NDkxOTk2Njgz.XXhmFw.IgagFyMii9zzY8gRAZBTPHxTkDU'
PREFIX = "$"
UPLOAD_LIMIT = 8
WHITELIST = [307429254017056769, 408521712725000199, 547881813088010241, 617606040724176896, 524060680853127168]    #Nigel Q, Ben D, Billy B, Ben M, James D
BLACKLIST = [209088521728688128, 416832121324306454]        #Nitro users
locked = []
confirm = False
command = None
#BLACKLIST = []
bot = commands.Bot(command_prefix = PREFIX)

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

@bot.event
async def on_message(message):
    global confirm, command
    #if "nitroflex" in message.content:
    #    nitroflex = [emoji for emoji in message.guild.emojis if "nitroflex" in emoji.name]
    #    for emoji in nitroflex:
    #        await message.add_reaction(emoji)

    if confirm and message.guild == None:
        if message.content == "y":
            await bot.process_commands(command)
            command = None
            confirm = False
        elif message.content == "n":
            command = None
            confirm = False

    elif message.guild == None and message.author.id != 307429254017056769 and message.author.id != 621179289491996683:
        user = bot.get_user(307429254017056769)
        await user.send(f"`{message.author.name}`: {message.content}")

    else:
        if message.content.startswith("$"):
            if starts(message.content, ["$follow", "$flex", "$nigelflex", "$play", "$download", "$connect", "$disconnect", "$lock", "$unlock", "$help", "$nitrowhisper", "$nitrobroadcast", "$kick", "$ban", "$unban", "$favourite", "$sec", "$bruh", "$lock"]):
                if message.guild.id != 621181741972979722:
                    await message.delete()

            if message.author.id in WHITELIST:
                await bot.process_commands(message) 

            elif message.author.id not in WHITELIST and message.author.id not in BLACKLIST and message.guild.id == 596128111859335208:
                user = bot.get_user(307429254017056769)
                await user.send(f"Would you like to authorize `{message.author.name}` running `{message.content}`? [y/n]: ")
                confirm = True
                command = message

            else:
                user = bot.get_user(307429254017056769)
                await user.send(f"`{message.author.name}` just ran `{message.content}`")
                await bot.process_commands(message)

        #elif message.author.id in BLACKLIST:
        #    print("NITROUSER DETECTED")

@bot.command()
async def flex(ctx, level = 0):
    #await ctx.message.delete()
    if level != 0:
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nitroflex" in emoji.name][:level]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)
    else:
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nitroflex" in emoji.name]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)

@bot.command()
async def nigelflex(ctx, level = 0):
    if level != 0:
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nigelflex" in emoji.name][:level]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)
    else:
        channel = bot.get_channel(ctx.channel.id)
        message = await channel.history(limit=1).flatten()
        message.reverse()  

        nitroflex = [emoji for emoji in ctx.guild.emojis if "nigelflex" in emoji.name]

        for emoji in nitroflex:
            await message[0].add_reaction(emoji)

@bot.command()
async def connect(ctx):
    try:
        channel = ctx.author.voice.channel
    except AttributeError:  
        await ctx.send("You are not connected to a voice channel!")
        return

    await channel.connect()    

@bot.command()
async def disconnect(ctx):
    server = ctx.message.guild.voice_client
    await server.disconnect()

@bot.command()
async def favourite(ctx, url):
    update("config\\favourites.json", {str(ctx.author.id): url})

@bot.command()
async def sec(ctx, target = None):
    if target == None:
        if ctx.author.voice and ctx.author.voice.channel:
            channel = ctx.author.voice.channel
    else:
        channel = bot.get_channel(int(target))

    await channel.connect()    

    voice = get(bot.voice_clients, guild = ctx.guild)
    if voice and voice.is_connected():
        await voice.move_to(channel)
    else:
        voice = await channel.connect()
    source = discord.FFmpegPCMAudio('play\\sec.mp3')
    player = voice.play(source)

    sleep(2)

    server = ctx.message.guild.voice_client
    await server.disconnect()

@bot.command()
async def bruh(ctx, target = None):
    if target == None:
        if ctx.author.voice and ctx.author.voice.channel:
            channel = ctx.author.voice.channel
    else:
        channel = bot.get_channel(int(target))

    await channel.connect()    

    voice = get(bot.voice_clients, guild = ctx.guild)
    if voice and voice.is_connected():
        await voice.move_to(channel)
    else:
        voice = await channel.connect()
    source = discord.FFmpegPCMAudio('play\\bruh.mp3')
    player = voice.play(source)

    sleep(2)

    server = ctx.message.guild.voice_client
    await server.disconnect()

@bot.command()
async def play(ctx, url = None, target = None):
    if url == None:
        url = load("config\\favourites.json")[str(ctx.author.id)]

    try:
        server = ctx.message.guild.voice_client
        await server.disconnect()
    except AttributeError:
        pass

    if target == None:
        if ctx.author.voice and ctx.author.voice.channel:
            channel = ctx.author.voice.channel
    else:
        channel = bot.get_channel(int(target))

    msgchannel = bot.get_channel(ctx.channel.id)
    update = await msgchannel.send("Processing...")

    ydl_opts = {
        'outtmpl': 'youtube\\{}.mp3'.format(url.split("=")[-1]),
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
    source = discord.FFmpegPCMAudio('youtube\\{}.mp3'.format(url.split("=")[-1]))
    player = voice.play(source)

@bot.command()
async def download(ctx, url):
    msgchannel = bot.get_channel(ctx.channel.id)
    update = await msgchannel.send("Downloading...")

    ydl_opts = {
        'outtmpl': 'youtube\\{}.mp3'.format(url.split("=")[-1]),
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    await ctx.send(file=discord.File('youtube\\{}.mp3'.format(url.split("=")[-1])))

    await update.delete()
    sleep(1)
    remove("youtube\\{}.mp3".format(url.split("=")[-1]))

@bot.command()
async def whatsmypeanut(ctx):
    level = list(str(ctx.message.author.id))
    level = ((((int(str(level[0]) + str(level[1])) + int(str(level[-1]) + str(level[-2])) // 2) * randint(1, 2)) + randint(1, 3)) - randint(1, 3) + int((list(str(ctx.message.author.guild.id))[0]))) - randint(5, 10)
    if level > 100:
        level = 100
    elif level < 0:
        level = 0
    await ctx.send("Your peanut meter level is currently at {}!".format(level))
    if level < 10 and level > 1:
        await ctx.send("Wow! That's a small peanut...")
    elif level == 1:
        await ctx.send("I'm disappointed...")
    elif level >= 10 and level <= 90:
        await ctx.send("Meh, I've seen better...")
    elif level > 90 and level < 100:
        await ctx.send("Wow! That's a huge peanut...")
    elif level == 100:
        await ctx.send("Impressive! I've never seen a bigger peanut!")
    else:
        await ctx.send("I don't know how, but you managed to break the scale, your peanut is off the charts!")
        
@bot.command()
async def whatstheirpeanut(ctx, user:discord.Member = None):
    level = list(str(user.id))
    level = ((((int(str(level[0]) + str(level[1])) + int(str(level[-1]) + str(level[-2])) // 2) * randint(1, 2)) + randint(1, 3)) - randint(1, 3) + int((list(str(ctx.message.author.guild.id))[0]))) - randint(5, 10)
    if level > 100:
        level = 100
    elif level < 0:
        level = 0
    await ctx.send("{}'s peanut meter level is currently at {}!".format(user, level))
    if level < 10 and level > 1:
        await ctx.send("Wow! That's a small peanut...")
    elif level == 1:
        await ctx.send("I'm disappointed...")
    elif level >= 10 and level <= 90:
        await ctx.send("Meh, I've seen better...")
    elif level > 90 and level < 100:
        await ctx.send("Wow! That's a huge peanut...")
    elif level == 100:
        await ctx.send("Impressive! I've never seen a bigger peanut!")
    else:
        await ctx.send("I don't know how, but you managed to break the scale, your peanut is off the charts!")

@bot.command()
async def lock(ctx, member:discord.Member = None, target = None):
    global locked
    if target == None:
        if ctx.author.voice and ctx.author.voice.channel:
            channel = ctx.author.voice.channel
    else:
        channel = bot.get_channel(int(target))

    locked.append(member)
    while member in locked:
        try:
            await member.move_to(channel)
        except: continue
        sleep(1)

@bot.command()
async def unlock(ctx, member:discord.Member = None):
    global locked
    locked.remove(member)

@bot.command()
async def follow(ctx, leader:discord.Member = None, follower:discord.Member = None):
    if ctx.author.voice and ctx.author.voice.channel:
        channel = ctx.author.voice.channel

    while True:
        try:
            await follower.move_to(channel)
        except: continue
        sleep(1)


@bot.command()
async def nitrowhisper(ctx, level = 1, target = None):
    if target == None:
        if ctx.author.voice and ctx.author.voice.channel:
            channel = ctx.author.voice.channel
    else:
        channel = bot.get_channel(int(target))

    await channel.connect()    

    voice = get(bot.voice_clients, guild = ctx.guild)
    if voice and voice.is_connected():
        await voice.move_to(channel)
    else:
        voice = await channel.connect()
    name = "nitrowhisperv{}".format(level)
    source = discord.FFmpegPCMAudio('play\\{}.mp3'.format(name))
    player = voice.play(source)

    sleep(1)

    server = ctx.message.guild.voice_client
    await server.disconnect()

@bot.command()
async def nitrobroadcast(ctx):
    pass

'''
@bot.command()
@has_permissions(kick_members = True)
async def kick(ctx, user: discord.User):
    await ctx.author.send("You have kicked `{}`".format(user.name))
    await ctx.guild.kick(user)

@bot.command()
@has_permissions(ban_members = True)
async def ban(ctx, user: discord.User):
    await ctx.author.send("You have banned `{}`".format(user.name))
    await ctx.guild.ban(user)

@bot.command()
@has_permissions(ban_members = True)
async def unban(ctx, user: discord.User):
    await ctx.author.send("You have unbanned `{}`".format(user.name))
    await ctx.guild.unban(user)
'''

bot.remove_command("help")

@bot.command()
async def help(ctx):
    embed = discord.Embed(title="Help!", description="Plexi Commands", color=0x00ff00)
    embed.add_field(name="$help", value="Display this page", inline=False)
    embed.add_field(name="$download <url>", value="Download a youtube video and upload the mp3 file (only works if under upload cap)", inline=False)
    embed.add_field(name="$favourite <url>", value="Use $play with no argument to play this song", inline=False)
    embed.add_field(name="$play <url> <target>", value="Plays a youtube video into the voice channel the user is in, leave url blank for favourite, leave target blank for current channel", inline=False)
    embed.add_field(name="$connect", value="Connect the bot to the user's voice channel", inline=False)
    embed.add_field(name="$disconnect", value="Disconnect the bot from it's voice channel", inline=False)
    embed.add_field(name="$whatsmypeanut", value="Check your peanut", inline=False)
    embed.add_field(name="$whatstheirpeanut <user>", value="Check their peanut", inline=False)
    embed.add_field(name="$lock <user>", value="Lock a user in the current voice channel", inline=False)
    embed.add_field(name="$unlock <user>", value="Unlock a user from their locked voice channel", inline=False)
    embed.add_field(name="$flex <level>", value="Flex on the previous message, leave level blank for max flex", inline=False)
    embed.add_field(name="$nigelflex <level>", value="???", inline=False)
    embed.add_field(name="$nitrowhisper <level> <target>", value="???", inline=False)
    embed.add_field(name="$bruh <target>", value="Bruh", inline=False)
    embed.add_field(name="$sec <target>", value="???", inline=False)
    #embed.add_field(name="$ban <user>", value="Ban a user", inline=False)
    #embed.add_field(name="$unban <user>", value="Unban a user", inline=False)
    #embed.add_field(name="$kick <user>", value="Kick a user", inline=False)

    embed.add_field(name="-------------------------------------", value="Work in progress:", inline=False)

    embed.add_field(name="$nitrobroadcast", value="...", inline=False)
    embed.add_field(name="$follow", value="...", inline=False)
    embed.add_field(name="$unfollow", value="...", inline=False)
    embed.add_field(name="$avoid", value="...", inline=False)
    embed.add_field(name="$unavoid", value="...", inline=False)

    await ctx.author.send(embed = embed)

bot.run(TOKEN)
