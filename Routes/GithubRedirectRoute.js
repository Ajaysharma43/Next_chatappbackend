import express from 'express'

const Router = express.Router()

Router.get('/github', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;
    const scope = encodeURIComponent('read:user user:email');

    const githubURL = `${process.env.GITHUB_API_2}/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
    res.redirect(githubURL);
})

export default Router