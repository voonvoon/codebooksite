import bcrypt from 'bcrypt';

export const hashPassword = (password) => {      // plain pw as argument
    return new Promise((resolve, reject) => {     // create promise will return resolve or reject
        bcrypt.genSalt(12, (err, salt) => {       //1st generate salt , 12 is good enough   
            if (err) {
              reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => { //2nd use salt hash pw, need salt, cb give bc err or hashedpw
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

export const comparePassword = (password, hashed) => {      // plain pw as argument hashed = hashed pw in db
    return bcrypt.compare(password, hashed);  // return true or false
};