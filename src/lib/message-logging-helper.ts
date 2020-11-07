import moment from 'moment';

export const logError = (messages: string[]) => {
    
    // function to console.log out a set of error messages
    const now = moment().format('YYYY-MM-DD HH:mm:ss ZZ');
    console.log(`[ERROR] ${now}`);

    // loop through the string array to console.log out the content.
    messages.forEach((m) => {
        console.log(m);
    })
    console.log(`----------`);
    return;
}

export const logInfo = (messages: string[]) => {
    
    // function to console.log out a set of info messages
    const now = moment().format('YYYY-MM-DD HH:mm:ss ZZ');
    console.log(`[INFO] ${now}`);

    // loop through the string array to console.log out the content.
    messages.forEach((m) => {
        console.log(m);
    })
    console.log(`----------`);
    return;
}