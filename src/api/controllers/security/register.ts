import model from '../../models/security/register';

const ctlr: any = {};

ctlr.registerUser = async(req, res) => {
    const outcome = await model.registerUser(req.body);
    res.json(outcome);
    return;
}

export default ctlr;