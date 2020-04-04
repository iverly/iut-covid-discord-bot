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
            if (messageTarget.embeds.length) {
                question = messageTarget.embeds[0].title.replace(/\*/g, '');
            } else {
                question = messageTarget.content.replace('poll: ', '') || 'Question introuvable';
            }

            const final = [['Étudiant', 'Pseudo', 'Réponse']];
            for (const reaction of messageTarget.reactions.values()) {
                const found = Object.keys(config.emojiId).filter(e => reaction.emoji.identifier === e);
                if (found.length) {
                    await reaction.fetchUsers();
                    reaction.users.forEach((u) => {
                        const member = getMemberFromUser(message.guild, u);
                        if (member && !member.user.bot) final.push([member.displayName, member.user.tag, config.emojiId[found[0]]]);
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
