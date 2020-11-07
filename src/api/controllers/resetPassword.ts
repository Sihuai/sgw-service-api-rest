import model from '../models/resetPassword';

const ctlr: any = {};

ctlr.request = async(req, res) => {
    const outcome = await model.request(req.body);
    res.json(outcome);
    return;
}

ctlr.execute = async(req, res) => {
    const outcome = await model.execute(req.body);
    res.json(outcome);
    return;
}

export default ctlr;