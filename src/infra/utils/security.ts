import { jwt }  from 'jsonwebtoken';

// function to generate a random verification code
export const createVerificationCode = async () => {
    const codeCharacters = Array.from('ABCD012389abzEFGH4567vwxyJKLMcdefNPQRrstuWXYZmnpqSTUVghjk');
    const fillers = Array.from('********');

    const otp = fillers.map((char) => {
        char = codeCharacters[Math.abs(Math.floor(Math.random() * 100) - 56)];
        return char;
    })

    return otp.join('');
}

export const generateToken = (params) => {
    try{
        // exceptions handling.
        if(params.expiresIn == false) return jwt.sign(params.content, params.key);
        // expiresIn is not empty.
        return jwt.sign(params.content, params.key, {expiresIn: params.expiresIn});
    }catch(err){
        throw err;
    }
}