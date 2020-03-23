import { Client, Message, TextChannel } from 'discord.js';
import { prefix } from '@/index';
import commands from '@/commands';

export default {
    name: 'message',
    async handler(client: Client, message: Message) {
        if (!message.content.startsWith(prefix)) return;
        const withoutPrefix = message.content.slice(prefix.length);
        const split = withoutPrefix.split(/ +/);
        const command = split[0];
        const args = split.slice(1);
        commands.forEach((c) => {
            if (c.name === command) c.handler(client, message.member, message, message.channel as TextChannel, args);
        });
    },
};
