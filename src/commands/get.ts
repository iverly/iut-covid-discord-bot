import { Client, TextChannel, GuildMember, Message, Attachment } from 'discord.js';
import { isMemberProfessor } from '@/utils/user';
import * as dateFormat from 'dateformat';
import * as csv from 'csv-stringify';

export default {
    name: 'get',
    async handler(client: Client, sender: GuildMember, message: Message, channel: TextChannel, args: string[]) {
        await message.delete();
        if (!isMemberProfessor(sender)) return;
        if (args[0]) {
            const roleTarget = message.guild.roles.get(args[0]);
            if (!roleTarget) {
                const messageSend = await channel.send('Role introuvable ...');
                return messageSend.delete(15 * 1000);
            }
            const menu = ['Identifiant', 'DisplayName'];
            const final = [menu];
            roleTarget.members.forEach(v => final.push([v.id, v.displayName]));
            csv(final, { delimiter: ';' }, (err, output) => {
                if (err) return;
                const buf = Buffer.from(output, 'utf8');
                sender.send(new Attachment(buf, `save-${dateFormat(new Date(), 'ddHHMMssl')}.csv`));
            });
        }
    },
};
