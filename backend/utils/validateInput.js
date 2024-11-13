// Utility responsible of validating user input on server side

const validator = require('validator');

// TODO: More advanced validators.
const validateRegisterInput = (data) => {
    const { username, email, password } = data;
    if (username.length < 5 || username.length > 16) {
      throw new Error('Username must be between 5 and 16 characters.');
    }
    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format.');
    }
    if (password.length < 8 || password.length > 50) {
      throw new Error('Password must be between 8 and 50 characters.');
    }
  }

function validateEventInput(data) {
    const { name, event_date } = data;
    if (!name || typeof name !== 'string') {
        throw new Error('Event name is required and must be a string.');
    }
    if (!event_date || isNaN(Date.parse(event_date))) {
        throw new Error('A valid event date is required.');
    }
}

module.exports = { validateRegisterInput, validateEventInput };