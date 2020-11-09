import dataStore from '../../../../lib/connect-to-arangodb-v2';
import { getList, parseFilter, addItem } from '../../../../lib/arangodb-helper';

const executor: any = {};

executor.add = async (params) => {
    // method to add a Media Content record

    // exceptions handling
    
    const ds = await dataStore.connect();
    const input = {
        insert: params.add,
        into: 'MediaContents',
        return: 'NEW'
    }

    // ok.
    try{
        const outcome = await addItem(input, ds.app);
        return outcome;

    }catch(err){
        throw err;
    }
}
export default executor;