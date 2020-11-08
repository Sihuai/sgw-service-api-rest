import model from '../models/security/users';

// import dotenv from 'dotenv';
// dotenv.config();

const ctlr: any = {};

ctlr.getProfile = async (req, res) => {
    // function to retrieve a specific user profile,
    // identified by email
    const outcome = await model.getProfile(req);
    res.json(outcome);
    return;
}

export default ctlr;