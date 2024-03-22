const z = require('zod')

const cancionSchema = z.object({
    titulo : z.string(),
    artista : z.string()
})

module.exports = cancionSchema