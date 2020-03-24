import { Guild, Role } from 'discord.js';

export function getRoleById(guild: Guild, roleId: string): Role {
    return guild.roles.get(roleId) || null;
}
