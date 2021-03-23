import { GraphQLServer } from 'graphql-yoga'
import uuidV4 from 'uuid/v4'

// Scalar types: String, Boolean, Int, Float, ID

// Demo user data
let users = [
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

let posts = [
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

let comments = [
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

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput): Comment!
    }

    input CreateUserInput {
        name: String! 
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            } 
            
            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            } 
            
            return posts.filter((posts) => {
                return posts.title.toLowerCase().includes(args.query.toLowerCase()) || posts.body.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        comments(parent, args, ctx, info) {
            return comments
        },
        me() {
            return {
                id: '123456',
                name: 'Colby',
                email: 'colby@care.com'
            }
        },
        post() {
            return {
                id: '123457',
                title: 'Hello world',
                body: 'Hello hello hello',
                published: true
            }
        }
    },
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email)

            if (emailTaken) {
                throw new Error('Email taken.')
            }

            const user = {
                id: uuidV4(),
                ...args.data
            }

            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id)

            if (userIndex === -1) {
                throw new Error('User not found!')
            }

            const deletedUsers = users.splice(userIndex, 1)
            
            posts = posts.filter((post) => {
                const match = post.author === args.id

                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id)
                }

                return !match
            })

            comments = comments.filter((comment) => comment.author !== args.id)

            return deletedUsers[0]
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User does not exist!')
            }

            const post = {
                id: uuidV4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id)

            if (postIndex === -1) {
                throw new Error('Post not found!')
            }

            const deletedPosts = posts.splice(postIndex, 1)
            
            comments = comments.filter((comment) => comment.post !== args.id)

            return deletedPosts[0]
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author)
            const postValid = posts.some((post) => post.id === args.data.post && post.published)

            if (!userExists) {
                throw new Error('User does not exist!')
            }

            if (!postValid) {
                throw new Error('Post does not exist!')
            }

            const comment = {
                id: uuidV4(),
                ...args.data
            }

            comments.push(comment)

            return comment
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.id === parent.comment
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => {
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post
            })
        },
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})