import { Client, TextChannel, GuildMember, Message } from 'discord.js';
import { getUserFromMention } from '@/utils/user';
import config from '@/config';

export default {
    name: 'go',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete();
        if (!sender.roles.has(config.professorId)) return;
        if (args[0]) {
            const target = getUserFromMention(channel.guild, args[0]);
            if (!target) {
                const messageSend = await channel.send('Utilisateur introuvable ...');
                return messageSend.delete(15 * 1000);
            }
            if (sender.id === target.id) return;

            if (target.user.presence.status === 'offline') {
                const messageSend = await channel.send('La personne est hors-ligne');
                return messageSend.delete(15 * 1000);
            }

            if (!target.voiceChannelID) {
                const messageSend = await channel.send('La personne est dans aucun channel');
                return messageSend.delete(15 * 1000);
            }

            if (sender.voiceChannelID === target.voiceChannelID) {
                const messageSend = await channel.send('La personne est dans votre channel');
                return messageSend.delete(15 * 1000);
            }

            if (sender.voiceChannelID) {
                sender.setVoiceChannel(target.voiceChannelID);
            } else {
                const messageSend = await channel.send(`La personne se situe dans le channel vocal: ${target.voiceChannel}`);
                return messageSend.delete(15 * 1000);
            }
        } else {
            const messageSend = await channel.send('Nous devez mentioner un quelqu\'un ! (@Nom)');
            return messageSend.delete(15 * 1000);
        }
    },
};
