import model from '../../models/app/categories';

const ctlr : any = {};

ctlr.add = async(req, res) => {
    
    // function to add a Category record.
    const outcome = await model.add(req.body);
    res.json(outcome);
    return;
}

ctlr.update = async(req, res) => {

    // function to update a specific Category record.
    const outcome = await model.update(req.body);
    res.json(outcome);
    return;
}

ctlr.remove = async(req, res) => {
    
    // function to remove a specific Category record.
    const outcome = await model.remove(req.body);
    res.json(outcome);
    return;
}

ctlr.get = async(req, res) => {
    
    // function to get Category records that matches
    // the filtering conditions.
    // filtering conditions are passed in as a JSON string
    // via the request query string.
    const outcome = await model.get(req);
    res.json(outcome);
    return;
}

export default ctlr;