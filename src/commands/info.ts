import { Client, TextChannel, GuildMember, Message, RichEmbed } from 'discord.js';
import { getUserFromMention } from '@/utils/user';
import config from '@/config';

export default {
    name: 'info',
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

            for (const v of Object.values(config.groupsId)) {
                const find = target.roles.array().filter(r => r.id === v[0]);
                if (find.length === 1) {
                    const embed = new RichEmbed()
                        .setColor('0xe32400')
                        .addField('Information de l\'étudiant', ' ឵឵', false)
                        .addField('Nom Prénom', target.nickname, true)
                        .addField('Groupe', v[1], true)
                        .addField('Status de l\'étudiant', getMemberStatus(target), false)
                        .setThumbnail(target.user.avatarURL || target.user.defaultAvatarURL);
                    const messageSend = await channel.send(embed);
                    messageSend.delete(30 * 1000);
                    return;
                }
            }
            const messageSend = await channel.send('Il semble que cette personne ne sont pas un étudiant ...');
            messageSend.delete(15 * 1000);
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
