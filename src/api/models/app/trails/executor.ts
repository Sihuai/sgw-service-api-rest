import dataStore from '../../../../lib/connect-to-arangodb-v2';
import { getList, parseFilter, addItem } from '../../../../lib/arangodb-helper';

const executor: any = {};

executor.add = async(params) => {

    const ds = await dataStore.connect();
    const input = {
        insert: params.add,
        into: 'Trails',
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