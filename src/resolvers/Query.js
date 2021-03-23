const Query = {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users
        } 
        
        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts
        } 
        
        return db.posts.filter((posts) => {
            return posts.title.toLowerCase().includes(args.query.toLowerCase()) || posts.body.toLowerCase().includes(args.query.toLowerCase())
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments
    }
}

export { Query as default }