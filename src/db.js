const users = [
    {
        id: "0",
        name: "Colby",
        email: "colby@care.com",
        age: 26
    },
    {
        id: "1",
        name: "Rocky",
        email: "rocky@care.com",
        age: 2
    },
    {
        id: "2",
        name: "Tootsie",
        email: "tootsie@care.com"
    }
]

const posts = [
    {
        id: "0",
        title: 'Hello world',
        body: 'Hello all',
        published: true,
        author: "1"
    },
    {
        id: "1",
        title: 'Nice to have you',
        body: 'Wish you were here',
        published: true,
        author: "1"
    },
    {
        id: "2",
        title: 'Goodbye',
        body: 'So long farewell',
        published: true,
        author: "0"
    }
]

const comments = [
    {
        id: "0",
        text: "This is good",
        author: "1",
        post: "0"
    },
    {
        id: "1",
        text: "This is bad",
        author: "1",
        post: "2"
    },
    {
        id: "2",
        text: "This is okay",
        author: "0",
        post: "0"
    },
    {
        id: "3",
        text: "This is not great",
        author: "2",
        post: "1"
    }
]

const db = {
    users,
    posts,
    comments
}

export { db as default }