import discord
from responder import getResponse
from discord.ext import commands

TOKEN = 'NjM4MjgwMjM5NjI1MjczMzY0.XbabAA.XSFy1RnXrCfD2LKhAP1ty3MEKFA'
bot = commands.Bot(command_prefix = ".gay ")

def replace_trash(unicode_string):
     for i in range(0, len(unicode_string)):
         try:
            unicode_string[i].encode("ascii")
         except:
            unicode_string = unicode_string.replace(unicode_string[i], " ")
     return unicode_string

@bot.event
async def on_ready():
    print('Logged in as')
    print(bot.user.name)
    print(bot.user.id)
    print('------')

@bot.event
async def on_message(message):
    channel = bot.get_channel(message.channel.id)
    response = getResponse(message.content)
    if response != None and message.author.id != 638280239625273364 and (message.channel.id == 638659193913737226 or message.guild.id == 621181741972979722):
        await channel.send(response)
    await bot.process_commands(message)

@bot.command()
async def get(ctx, user: discord.Member):
    await ctx.message.delete()

    messages = await ctx.channel.history(limit = 3000).flatten()
    total = []
    for message in range(len(messages)):
        if messages[message].author.id == user.id and messages[message - 1].author.id != user.id and messages[message].author.id != messages[message - 1].author.id:
            total.append(messages[message - 1].content)
            total.append(messages[message].content)

    total.reverse()

    for i in range(len(total)):
        total[i] = replace_trash(total[i])

    with open("data.txt", "a+") as f:
        f.write("\n".join(total))

bot.run(TOKEN)