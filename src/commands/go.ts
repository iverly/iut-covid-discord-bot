import { Client, User, TextChannel, GuildMember, Message } from 'discord.js';
import { getUserFromMention } from '@/utils/user';

export default {
    name: 'go',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete();
        if (args[0]) {
            const target = getUserFromMention(channel.guild, args[0]);
            if (sender.voiceChannelID === target.voiceChannelID) return;
            if (sender.voiceChannelID) {
                await sender.setVoiceChannel(target.voiceChannelID);
            } else {
                const messageSend = await channel.send(`La personne se situe dans le channel vocal: ${target.voiceChannel}`);
                messageSend.delete(5000);
            }
        } else {
            const messageSend = await channel.send('Nous devez mentioner un quelqu\'un ! (@Nom)');
            messageSend.delete(5000);
        }
    },
};
