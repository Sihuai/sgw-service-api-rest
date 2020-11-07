import moment from 'moment';
import ds from '../../../lib/connect-to-arangodb-v2';
import { executeScript } from '../../../lib/arangodb-helper';

const executor: any = {};

executor.request = async (params) => {
    // function to register a request to reset password
    // in the user record in db.

    const vcode = generateVerificationCode();
    const datetimeNow = moment();

    const aql = `
    LET foundUsers = (
        FOR i IN Users
        FILTER(
            i.email == '${params.email}'
        )
        RETURN {
            "_key": i._key,
            "_rev" : i._rev,
            "_id" : i._id,
            "email": i.email
        }
    )
        
    FOR u IN foundUsers
        UPDATE {
            _key: u._key,
            _rev: u._rev
        }WITH{
            resetToken : {
                dateRequested: '${datetimeNow.clone().format('YYYY-MM-DD HH:mm:ss')}',
                dateExpires: '${datetimeNow.clone().add(15, 'minutes').format('YYYY-MM-DD HH:mm:ss')}',
                code: '${vcode}',
                resolved: false
            }
        }IN Users
        RETURN {
            "_id" : NEW._id,
            "_key": NEW._key,
            "_rev" : NEW._rev,
            "username" : NEW.username,
            "nick": NEW.nick,
            "email": NEW.email
        }
    `;

    try{
        const outcome = await executeScript(aql, ds.security);
        ds.security.close();
        return outcome;
    }catch(err){
        throw err;
    }
}

executor.reset = async (params) => {

    // function to reset the password
    // of a user, identified by email and verification code.
    const datetimeNow = moment().format('YYYY-MM-DD HH:mm:ss');
    const aql = `
    LET foundUsers = (
        FOR i IN Users
        FILTER(
            i.email == '${params.email}' &&
            i.resetToken.code == '${params.code}' &&
            NOT i.resetToken.resolved &&
            i.resetToken.dateExpires > '${datetimeNow}'
        )
        RETURN {
        
            "_id": i._id,
            "_key" : i._key,
            "_rev" : i._rev,
            "email" : i.email,
            "nick" : i.nick,
            "resetToken": i.resetToken
        }
    )
    
    FOR u IN foundUsers
        UPDATE {
            _key: u._key,
            _rev: u._rev
        }WITH{
            pwhash : '${params.pwhash}',
            resetToken : {
                resolved: true
            }
        }IN Users
        RETURN u
    `;

    try{
        const outcome = await executeScript(aql, ds.security);
        return outcome;
    }catch(err){
        throw err;
    }
}

// private functions
const generateVerificationCode = () => {
    // function to generate a random verification code

    const codeCharacters = Array.from('ABCD012389abzEFGH4567vwxyJKLMcdefNPQRrstuWXYZmnpqSTUVghjk');
    const fillers = Array.from('********');

    const otp = fillers.map((char) => {
        char = codeCharacters[Math.abs(Math.floor(Math.random() * 100) - 56)];
        return char;
    })

    // exit with otp code.
    return otp.join('');
}

export default executor;