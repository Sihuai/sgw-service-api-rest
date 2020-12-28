import moment from 'moment';

export const logError = (messages: string[]) => {
    // function to console.log out a set of error messages
    const now = moment().format('YYYY-MM-DD HH:mm:ss ZZ');
    console.error(`[ERROR] ${now}`);

    // loop through the string array to console.log out the content.
    messages.forEach((m) => {
        console.error(m);
    })
    console.error(`----------`);
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
}

export const logPayment = (messages: string[]) => {
    // function to console.log out a set of info messages
    const now = moment().format('YYYY-MM-DD HH:mm:ss ZZ');
    console.log(`[INFO] ${now}`);

    // loop through the string array to console.log out the content.
    messages.forEach((m) => {
        console.log(m);
    })
    console.log(`----------`);
}