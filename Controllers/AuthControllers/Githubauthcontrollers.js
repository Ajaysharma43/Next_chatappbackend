import pool from "../../Databaseconnection/DBConnection.js";
import jwt from 'jsonwebtoken';

/**
 * Check if a GitHub user exists in the DB and generate JWT tokens if found.
 */
export const checkGithubUser = async (token) => {
    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE socialid = $1`,
            [token.id]
        );

        if (result.rowCount === 1) {
            const user = result.rows[0];
            const payload = {
                id: user.id,
                username: user.name,
                socialauthenticated: user.socialauthenticated,
                profile: user.profilepic,
                role: user.roles,
            };

            const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '2h',
            });
            const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '7d',
            });

            return {
                userExists: true,
                accessToken,
                refreshToken,
                user: payload,
            };
        } else {
            return { userExists: false };
        }
    } catch (error) {
        throw new Error('Error occurred while finding a GitHub user');
    }
};

/**
 * Create a new GitHub user in the DB.
 */
export const createGithubUser = async (token) => {
    try {
        console.log(token)
        const result = await pool.query(
            `
      INSERT INTO users(socialid, name, socialauthenticated, profilepic)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
            [token.id, token.name, true, token.avatar]
        );

        if (result.rowCount === 1) {
            return result.rows[0];
        } else {
            throw new Error('User creation failed');
        }
    } catch (error) {
        console.log(error)
    }
};

/**
 * Generate JWT tokens for an existing GitHub user.
 */
export const generateGithubTokens = async (token) => {
    try {
        const result = await pool.query(
            `SELECT * FROM users WHERE socialid = $1`,
            [token.id]
        );

        const user = result.rows[0];

        const payload = {
            id: user.id,
            username: user.name,
            socialauthenticated: user.socialauthenticated,
            profile: user.profilepic,
            role: user.roles,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h',
        });
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        console.log(error)
    }
};
