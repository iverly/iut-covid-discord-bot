import { Client } from 'discord.js';
import events from '@/events';

const client = new Client();

client.once('ready', () => {
    client.user.setStatus('dnd');
});

events.forEach((e) => {
    client.on(e.name, e.handler.bind(client, this));
});

export default client;
