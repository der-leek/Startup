function validate_fields() {
    const fields = document.querySelectorAll('.field');
    const has_empty_field = Array.from(fields).some(field => field.value === '');
    
    const email = document.querySelector('#email').value;
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const confirmation = document.querySelector('#confirmation').value;

    // add funcionality to clear fields on new click!
    if (has_empty_field) {
        const error_message = document.createElement('p');
        error_message.textContent = 'All fields are required';

        const parent_element = document.getElementById('form');
        parent_element.appendChild(error_message)
        throw new Error('All fields are required');
    } else if (password !== confirmation) {
        const error_message = document.createElement('p');
        error_message.textContent = 'Passwords must match';

        const parent_element = document.getElementById('form');
        parent_element.appendChild(error_message)
        throw new Error('Passwords must match');
    }

    return([email, username, password, confirmation]);
}

function new_user() {
    [user_email, username, user_password, confirmation] = validate_fields();
    
    const test = localStorage.getItem('user_credentials');
    if (test === null) {
        let user_credentials = new Map();
        user_credentials.set(username, { email: user_email, password: user_password});
    
        const serialized_credentials = JSON.stringify(Array.from(user_credentials.entries()));
        localStorage.setItem('user_credentials', serialized_credentials);
    } else {
        let deserialized_credentials = new Map(JSON.parse(test));
        deserialized_credentials.set(username, { email: user_email, password: user_password});
        const serialized_credentials = JSON.stringify(Array.from(deserialized_credentials.entries()));
        localStorage.setItem('user_credentials', serialized_credentials);
    }
}