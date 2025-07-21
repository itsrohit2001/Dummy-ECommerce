const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

function generateHash(password) {
    return bcrypt.hashSync(password, SALT_ROUNDS); // blocking version
}

function validateHash(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}
module.exports = { generateHash, validateHash };