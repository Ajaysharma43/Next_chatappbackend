import express from 'express'
import axios from 'axios';
import { checkGithubUser, createGithubUser, generateGithubTokens } from '../../Controllers/AuthControllers/Githubauthcontrollers.js';

const Router = express.Router()

Router.get('/callback/github', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(400).json({ error: 'No code received from GitHub' });
    }

    try {
        // Exchange code for access token
        const tokenRes = await axios.post(
            `${process.env.GITHUB_API_2}/access_token`,
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: process.env.GITHUB_REDIRECT_URI,
            },
            {
                headers: { Accept: 'application/json' },
            }
        );

        const { access_token } = tokenRes.data;

        if (!access_token) {
            return res.status(400).json({ error: 'Access token not received' });
        }

        // Get GitHub user profile
        const userRes = await axios.get(`${process.env.GITHUB_API_1}`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        // Get primary email
        const emailRes = await axios.get(`${process.env.GITHUB_API_1}/emails`, {
            headers: { Authorization: `Bearer ${access_token}` },
        });


        const userEmail = emailRes.data.find(email => email.primary && email.verified)?.email;

        const user = {
            id: userRes.data.id,
            name: userRes.data.name,
            username: userRes.data.login,
            avatar: userRes.data.avatar_url,
            email: userEmail,
        };
        let token = user

        const CheckUser = await checkGithubUser(token)
        if (CheckUser.userExists == true) {
            const redirectUrl = `${process.env.FRONTEND_URL}/login?AccessToken=${CheckUser.accessToken}&RefreshToken=${CheckUser.refreshToken}&status=authenticated`;
            res.redirect(redirectUrl);
        }
        else {
            const CreateUser = createGithubUser(token)
            const generatetokens = generateGithubTokens(token)
            const redirectUrl = `${process.env.FRONTEND_URL}/login?AccessToken=${generatetokens.accessToken}&RefreshToken=${generatetokens.refreshToken}&status=authenticated`;
            res.redirect(redirectUrl);
        }

    } catch (err) {
        console.error('GitHub OAuth Error:', err?.response?.data || err.message);
        res.status(500).json({ error: 'GitHub login failed' });
    }
})

export default Router