/** @type {import("typeorm").ConnectionOptions} */
const dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    /** @type {import("typeorm").ConnectionOptions} */
    let devConfig = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    };
    Object.assign(dbConfig, devConfig);
    break;
  case 'test':
    /** @type {import("typeorm").ConnectionOptions} */
    let testConfig = {
      type: 'sqlite',
      database: ':memory:',
      entities: ['**/*.entity.ts'],
    };
    Object.assign(dbConfig, testConfig);
    break;
  case 'production':
    break;
  default:
    throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`);
}

module.exports = dbConfig;
