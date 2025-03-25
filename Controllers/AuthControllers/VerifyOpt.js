const VerifyOpt = (req , res , next) => {
    try {
        const {OPT} = req.body;
    } catch (error) {
        res.status(404).json({error : error})
    }
}