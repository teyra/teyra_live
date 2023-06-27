export const redisConfig = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_URL,
  username: '',
  password: process.env.REDIS_PASSWORD,
  db: 0,
};
export const redisClusterConfig = [
  {
    port: 6379, // Redis port
    host: '127.0.0.1', // Redis host
    username: '', // needs Redis >= 6
    password: '',
    db: 0, // Defaults to 0
  },
  {
    port: 6379, // Redis port
    host: '127.0.0.1', // Redis host
    username: '', // needs Redis >= 6
    password: '',
    db: 0, // Defaults to 0
  },
];
