import { Client, TextChannel, GuildMember, Message, RichEmbed } from 'discord.js';
import { getUserFromMention, getMemberGroupId, getMemberGroup } from '@/utils/user';
import config from '@/config';

export default {
    name: 'info',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete(2000);
        if (!sender.roles.has(config.professorId)) return;
        if (args[0]) {
            const target = getUserFromMention(channel.guild, args[0]);

            if (!target) {
                const messageSend = await channel.send('Utilisateur introuvable ...');
                return messageSend.delete(15 * 1000);
            }
            if (sender.id === target.id) return;

            const group = getMemberGroup(channel.guild, target);
            if (!group) {
                const messageSend = await channel.send('Il semble que cette personne ne sont pas un étudiant ...');
                return messageSend.delete(15 * 1000);
            }

            const embed = new RichEmbed()
                .setColor('0xe32400')
                .addField('Information de l\'étudiant', ' ឵឵', false)
                .addField('Nom Prénom', target.nickname, true)
                .addField('Groupe', group.name, true)
                .addField('Status de l\'étudiant', getMemberStatus(target), false)
                .setThumbnail(target.user.avatarURL || target.user.defaultAvatarURL);
            const messageSend = await channel.send(embed);
            messageSend.delete(30 * 1000);
        } else {
            const messageSend = await channel.send('Nous devez mentioner un quelqu\'un ! (@Nom)');
            return messageSend.delete(15 * 1000);
        }
    },
};

function getMemberStatus(member: GuildMember): string {
    if (member.user.presence.status === 'offline') return 'Hors-ligne';
    if (!member.voiceChannelID) return 'Connecté';
    return `Dans le salon vocal: ${member.voiceChannel.toString()}`;
}
