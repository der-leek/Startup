function typewriter(element, text, index=0) {    
    if (index < text.length) {
        element.innerHTML = text.slice(0, index);
        index++;
        
        let random_delay = Math.random() + text.length; // Base delay
        if (Math.random() < 0.5) { // 10% chance of a pause
            random_delay += Math.random() * 250; // Add up to 0.25 seconds extra
        }
        setTimeout(() => typewriter(element, text, index), random_delay);
    } else {
        element.innerHTML = text.slice(0, index);
    }
}

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

async function createUser() {
    loginOrCreate(`/api/auth/create`);
}

function message(text) {
    const message = document.createElement('p');
    message.classList.add('response');
    message.textContent = text;

    const parent_element = document.getElementById('form');
    return [message, parent_element];
}

async function loginOrCreate(endpoint) {
    [user_email, username, user_password, confirmation] = validate_fields();
    
    const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ email: user_email, username: username, password: confirmation }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    });
    
    if (document.querySelector('.response')) { 
        let successElements = document.querySelectorAll('.response');

        for (let i = 0; i < successElements.length; i++) {
            successElements[i].remove();
        }
    };

    if (!response.ok) {
        let [response, parent_element] = message('User already exists');
        parent_element.appendChild(response);

        typewriter(response, response.textContent);
        throw new Error('User already exists');
    } else { // if the user is created successfully
        localStorage.setItem('username', username);
        let [response, parent_element] = message('welcome to whisper, ' + username);
        parent_element.appendChild(response);    

        response.style.fontSize = '2em';
        let button = document.getElementById('submit_credentials');
        button.remove();
        typewriter(response, response.textContent);
    };
}

// function new_user() {
//     [user_email, username, user_password, confirmation] = validate_fields();
    
//     const test = localStorage.getItem('user_credentials');
//     if (test === null) {
//         let user_credentials = new Map();
//         user_credentials.set(username, { email: user_email, password: user_password});
    
//         const serialized_credentials = JSON.stringify(Array.from(user_credentials.entries()));
//         localStorage.setItem('user_credentials', serialized_credentials);
//     } else {
//         let deserialized_credentials = new Map(JSON.parse(test));
//         deserialized_credentials.set(username, { email: user_email, password: user_password});
//         const serialized_credentials = JSON.stringify(Array.from(deserialized_credentials.entries()));
//         localStorage.setItem('user_credentials', serialized_credentials);
//     }
// }