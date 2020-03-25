import { Client, TextChannel, GuildMember, Message } from 'discord.js';
import { isMemberProfessor, getUserFromMention } from '@/utils/user';

export default {
    name: 'mp',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete();
        if (!isMemberProfessor(sender)) return;
        if (args[0]) {
            const target = getUserFromMention(channel.guild, args[0]);
            if (!target) {
                const messageSend = await channel.send('Utilisateur introuvable ...');
                return messageSend.delete(15 * 1000);
            }
            if (sender.id === target.id) return;
            sender.send(`<@${target.id}>`);
        }
    },
};
