import { Client, TextChannel, GuildMember, Message } from 'discord.js';
import config from '@/config';
import { isMemberProfessorOrDelegue } from '@/utils/user';
import to from 'await-to-js';

export default {
    name: 'clean',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete();
        if (!sender.roles.has(config.professorId) && !sender.roles.has(config.delegueId)) return;
        if (args[0]) {
            const number = parseInt(args[0], 10);
            if (isNaN(number)) return;
            const messages = await channel.fetchMessages({ limit: number });
            for (const [s, m] of messages) {
                if (!m.member) await to(message.guild.fetchMember(m));
                if (m.member && isMemberProfessorOrDelegue(m.member)) messages.delete(s);
            }
            channel.bulkDelete(messages);
        }
    },
};
