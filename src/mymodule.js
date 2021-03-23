// Named export, have as many as needed
// Default export, can only have one

const message = "Message from module"

const name = "Colby"

const location = "Philly"

const getGreeting = (name) => {
    return `Welcome to the course ${name}`
}

export { message, name, getGreeting, location as default }