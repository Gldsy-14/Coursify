import jwt from "jsonwebtoken"
export function generateToken(id) {
    const access_token = jwt.sign({ id: id }, "lkasjdflkjlkasdfhhnkwenhranf", {
        expiresIn: 15
    })
    const refresh_token = jwt.sign({ id: id }, "jlkhjwaeurjkaldfjlkjalsdjfj", {
        expiresIn: '30d'
    })

    return { access_token, refresh_token }
}
