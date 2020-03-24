import { Guild, GuildMember, Role } from 'discord.js';
import config from '@/config';
import { getRoleById } from './role';

export function getUserFromMention(guild: Guild, mentionFrom: string) {
    let mention = mentionFrom;
    if (!mention) return;

    if (mention.startsWith('<@') && mention.endsWith('>')) {
        mention = mention.slice(2, -1);

        if (mention.startsWith('!')) {
            mention = mention.slice(1);
        }

        return guild.members.get(mention) || null;
    }
}

export function isMemberProfessorOrDelegue(member: GuildMember) {
    return member.roles.has(config.professorId) || member.roles.has(config.delegueId);
}

export function getMemberGroupId(member: GuildMember): string {
    for (const v of Object.values(config.groupsId)) {
        const find = member.roles.array().filter(r => r.id === v[0]);
        if (find.length > 0) return v[0];
    }
    return null;
}

export function getMemberGroup(guild: Guild, member: GuildMember): Role {
    const roleId = getMemberGroupId(member);
    if (!roleId) return null;
    return getRoleById(guild, roleId);
}
