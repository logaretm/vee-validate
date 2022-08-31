export default {
  algolia: {
    apiKey: '63f5a0934f840b36e5d33af009ddff15',
    appId: 'F6BYW6NAIH',
    indexName: 'vee-validate-v4',
  },
  appURL: process.env.NODE_ENV === 'production' ? 'https://vee-validate.logaretm.com' : 'http://localhost:3000',
  gaId: 'UA-100131478-1',
} as const;
