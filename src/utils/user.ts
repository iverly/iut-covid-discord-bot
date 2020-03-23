import { Client, Guild } from 'discord.js';
import config from '@/config';

export function getUserFromMention(guild: Guild, mentionFrom: string) {
    let mention = mentionFrom;
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return guild.members.get(mention);
    }
}
