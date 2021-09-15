const express = require('express')
const app = express()

app.use(express.json())


let notes = [
    {
        id: 1,
        title: "HTML is easy",
        content: "HTML is easy",
    },
    {
        id: 2,
        title: 'Asfa',
        content: "Browser can execute only Javascript",
    },
    {
        id: 3,
        title: 'kolmas tiitel',
        content: "GET and POST are the most important methods of HTTP protocol",
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/v1/posts', (req, res) => {
    res.json(notes)
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/v1/posts', (request, response) => {
    const body = request.body
    console.log(body);

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
})

app.get('/api/v1/posts/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/v1/posts/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
