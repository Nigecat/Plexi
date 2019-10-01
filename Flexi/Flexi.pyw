import discord
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

@bot.event
async def on_message(message):
    if "nitroflex" in message.content:
        nitroflex = [emoji for emoji in message.guild.emojis if "nitroflex" in emoji.name]
        for emoji in nitroflex:
            await message.add_reaction(emoji)

    await bot.process_commands(message) 
    
@bot.command()
async def sndmsg(ctx, *, msg):
    await ctx.message.delete()
    await ctx.send(msg)

@bot.command()
async def flex(ctx, level = 0):
    await ctx.message.delete()
    channel = bot.get_channel(ctx.channel.id)
    message = await channel.history(limit=1).flatten()
    message.reverse()  

    nitroflex = [emoji for emoji in ctx.guild.emojis if "nitroflex" in emoji.name][:level]

    for emoji in nitroflex:
        await message[0].add_reaction(emoji)

bot.run(TOKEN)
