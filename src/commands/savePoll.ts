import { Client, TextChannel, GuildMember, Message, Attachment } from 'discord.js';
import { isMemberProfessor, getUserFromMention, getMemberFromUser } from '@/utils/user';
import config from '@/config';
import * as dateFormat from 'dateformat';
import * as csv from 'csv-stringify';

export default {
    name: 'savepoll',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete();
        if (!isMemberProfessor(sender)) return;
        if (args[0]) {
            let messageTarget: Message;
            try {
                messageTarget = await channel.fetchMessage(args[0]);
            } catch (err) {
                const messageSend = await channel.send('Message introuvable ...');
                return messageSend.delete(15 * 1000);
            }
            if (!messageTarget) {
                const messageSend = await channel.send('Message introuvable ...');
                return messageSend.delete(15 * 1000);
            }

            let question: string;
            let lines: string[] = [];
            if (messageTarget.embeds.length) {
                question = messageTarget.content.replace(/\*/g, '').replace(':bar_chart: ', '') || 'Question introuvable';
                lines = messageTarget.embeds[0].description.split('\n');
                lines = lines.filter(r => r);
            } else {
                question = messageTarget.content.replace(/\*/g, '').replace(':bar_chart: ', '') || 'Question introuvable';
            }

            const menu = ['Étudiant', 'Identifiant', 'Réponse'];
            if (lines.length) menu.push('Intitulé');
            const final = [menu];
            for (const reaction of messageTarget.reactions.values()) {
                const found = Object.keys(config.emojiId).filter(e => reaction.emoji.identifier === e);
                if (found.length) {
                    const foundEmoji = lines.filter(r => r.startsWith(config.emojiId[found[0]][1]));
                    const response = foundEmoji.length ? foundEmoji[0].split(' ').slice(1).join(' ') : null;
                    await reaction.fetchUsers();
                    reaction.users.forEach((u) => {
                        const member = getMemberFromUser(message.guild, u);
                        const result = [member.displayName, member.user.id, config.emojiId[found[0]][0]];
                        if (response) result.push(response);
                        if (member && !member.user.bot) final.push(result);
                    });
                }
            }

            csv(final, { delimiter: ';' }, (err, output) => {
                if (err) return;
                const buf = Buffer.from(`${question}\n${output}`, 'utf8');
                sender.send(new Attachment(buf, `sondage-${dateFormat(new Date(), 'ddHHMMssl')}.csv`));
            });
        }
    },
};
