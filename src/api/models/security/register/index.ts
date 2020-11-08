import executor from './executor';
import ds from '../../../../lib/connect-to-arangodb-v2';

const model: any = {}


model.registerUser = async(params: any) => {
    
    // function to register a new user
    
    const outcome = await executor.addUser(params);
    return outcome;
}

export default model;
