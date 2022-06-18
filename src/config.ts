const freeLimit = parseInt(process.env.FREE_POST_LIMIT || '');
export const FREE_POST_LIMIT = !isNaN(freeLimit) ? freeLimit : 5;

export const NODE_ENV = process.env.NODE_ENV || 'dev';
