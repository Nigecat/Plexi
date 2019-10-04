import discord
from time import sleep
from discord.utils import get
from discord.ext import commands

#       !#$%(#^%(&%(#@&%&*)))gewg3rwg @Waiting Room#0924 

TOKEN = 'NjI5Mjg1MzA0OTg1MTkwNDEw.XZXhpA.QEU9MA9SWJi2QLxTE7FO67NfKv0'
PREFIX = "!#$%(#^%(&%(#@&%&*)))"
bot = commands.Bot(command_prefix = PREFIX)

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

@bot.event
async def on_message(message):
    if message.content.startswith("!#$%(#^%(&%(#@&%&*)))"):
        await message.delete()
        await bot.process_commands(message) 

@bot.command()
async def gewg3rwg(ctx, member:discord.Member = None):
    channel = ctx.author.voice.channel

    await channel.connect()    

    voice = get(bot.voice_clients, guild = ctx.guild)
    if voice and voice.is_connected():
        await voice.move_to(channel)
    else:
        voice = await channel.connect()

    source = discord.FFmpegPCMAudio('music.mp3')
    player = voice.play(source)
    
    while True:
        sleep(1)
        await member.move_to(channel)

bot.run(TOKEN)