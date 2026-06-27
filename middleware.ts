import jwt from 'jsonwebtoken'
export async function authentication(req, res, next) {
    try {
        const authorization = req.header("Authorization");
        console.log(authorization)

        const token = authorization.split(" ")[1]
        // ["Bearer", "eji12j3kljasdfu3..."]
        // token = eji12j3kljasdfu3
        const data = jwt.verify(token, "lkasjdflkjlkasdfhhnkwenhranf")
        console.log(data)
        next()
    } catch (error) {
        res.status(401).send("Invalid token")
    }
}