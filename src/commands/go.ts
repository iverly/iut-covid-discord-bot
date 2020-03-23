import { Client, User, TextChannel, GuildMember, Message } from 'discord.js';
import { getUserFromMention } from '@/utils/user';

export default {
    name: 'go',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete();
        if (args[0]) {
            const target = getUserFromMention(channel.guild, args[0]);
            if (target.user.presence.status === 'offline') {
                const messageSend = await channel.send('La personne est hors-ligne');
                return messageSend.delete(5000);
            }

            if (sender.voiceChannelID === target.voiceChannelID) return;
            if (sender.voiceChannelID) {
                sender.setVoiceChannel(target.voiceChannelID);
            } else {
                const messageSend = await channel.send(`La personne se situe dans le channel vocal: ${target.voiceChannel}`);
                return messageSend.delete(5000);
            }
        } else {
            const messageSend = await channel.send('Nous devez mentioner un quelqu\'un ! (@Nom)');
            return messageSend.delete(5000);
        }
    },
};
