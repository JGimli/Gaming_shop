
const Pool = require('pg').Pool;
const { promisify } = require('util');
const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('crypto');
require('dotenv').config();

const scrypt = promisify(scryptCallback);
const pool = new Pool({
    user: process.env.PG_USER || 'postgres',
    host: process.env.PG_HOST || 'localhost',
    database: process.env.PG_DATABASE || 'gamestore',
    password: process.env.PG_PASSWORD || '123',
    port: process.env.PG_PORT || 5432,
});

const createRegistrationError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const validateUser = (user) => {
    if (!user || typeof user !== 'object' || Array.isArray(user)) {
        return 'A user object is required';
    }

    const { username, email, password } = user;
    if (typeof username !== 'string' || username.length < 3 || username.length > 100) {
        return 'Username must be between 3 and 100 characters';
    }
    if (
        typeof email !== 'string' ||
        email.length < 5 ||
        email.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        return 'A valid email between 5 and 255 characters is required';
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 100) {
        return 'Password must be between 8 and 100 characters';
    }

    return null;
};

const hashPassword = async (password) => {
    const salt = randomBytes(16);
    const derivedKey = await scrypt(password, salt, 32);
    return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
};

const verifyPassword = async (password, passwordHash) => {
    if (typeof passwordHash !== 'string') {
        return false;
    }

    const [algorithm, saltString, keyString] = passwordHash.split('$');
    if (algorithm !== 'scrypt' || !saltString || !keyString) {
        return false;
    }

    const salt = Buffer.from(saltString, 'base64url');
    const storedKey = Buffer.from(keyString, 'base64url');
    if (salt.length !== 16 || storedKey.length !== 32) {
        return false;
    }

    const derivedKey = await scrypt(password, salt, storedKey.length);
    return timingSafeEqual(storedKey, derivedKey);
};

const registerUser = async (user) => {
    const validationError = validateUser(user);
    if (validationError) {
        throw createRegistrationError(validationError, 400);
    }

    const { username, email, password } = user;
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING username, email',
            [username, normalizedEmail, passwordHash]
        );
        return result.rows[0];
    } catch (error) {
        if (error.code === '23505') {
            throw createRegistrationError('A user with this email already exists', 409);
        }
        throw error;
    }
};

const authenticateUser = async (credentials) => {
    if (
        !credentials ||
        typeof credentials !== 'object' ||
        Array.isArray(credentials) ||
        typeof credentials.email !== 'string' ||
        credentials.email.length < 5 ||
        credentials.email.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email) ||
        typeof credentials.password !== 'string' ||
        credentials.password.length < 8 ||
        credentials.password.length > 100
    ) {
        throw createRegistrationError('A valid email and password are required', 400);
    }

    const result = await pool.query(
        'SELECT username, email, password_hash FROM users WHERE email = $1',
        [credentials.email.trim().toLowerCase()]
    );
    const user = result.rows[0];
    if (!user || !(await verifyPassword(credentials.password, user.password_hash))) {
        throw createRegistrationError('Invalid email or password', 401);
    }

    return { username: user.username, email: user.email };
};

module.exports = {
    registerUser,
    authenticateUser,
};
