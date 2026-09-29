export { default as classList } from './class-list';
export * from './tip-categories';
export * from './war-tiers';
export * from './master-class';

export const SITE = {
  name: '포냥이',
  domain: 'bdopvp.com',
  url: 'https://bdopvp.com',
  discordUrl: 'https://discord.com/invite/mD37c4GEby',
  game: '검은사막 온라인',
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  guildLeaguePageSize: 10,
  solarePageSize: 50,
} as const;

export const CACHE = {
  revalidate: {
    short: 60,
    medium: 300,
    long: 3600,
  },
} as const;
