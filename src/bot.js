const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
    client.user.setStatus('dnd');
})

module.exports = client;