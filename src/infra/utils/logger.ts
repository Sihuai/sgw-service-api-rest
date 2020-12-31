import moment from 'moment';
import path from 'path';

export const logError = (messages: string[]) => {
    // function to console.log out a set of error messages
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss ZZ');
    console.error(`[ERROR] ${now}`);

    // loop through the string array to console.log out the content.
    messages.forEach((m) => {
        console.error(m);
    })
    console.error(`----------`);
}

export const logInfo = (messages: string[]) => {
    // function to console.log out a set of info messages
    const now = moment().utc().format('YYYY-MM-DD HH:mm:ss ZZ');
    console.log(`[INFO] ${now}`);

    // loop through the string array to console.log out the content.
    messages.forEach((m) => {
        console.log(m);
    })
    console.log(`----------`);
}

export const logPaymentTrade = (content: any) => {
  const paymentFolder = 'payment/';
  const tradeFolder = 'trade/';
  
  const timestamp = moment().utc().format('YYMMDD_HHmmssSSS');
  const fullName = path.join(__dirname, paymentFolder + tradeFolder + timestamp + '.txt');

  var folder = path.join(__dirname, paymentFolder);
  
  const fs = require('fs');
  fs.stat(folder, function(err) {
    if (err) {
      fs.mkdir(folder, function(err) {
        if (err) {

          return console.error(err);
        } else {

          fs.mkdir(folder + tradeFolder, function(err) {
            if (err) {
              return console.error(err);
            } else {
              fs.writeFile(fullName, content, function(err) {
                if (err) return console.log(err);
              });
            }
          });
        }
      });
    } else {
      
      fs.writeFile(fullName, content, function(err) {
        if (err) return console.log(err);
      });
    }
  });
}