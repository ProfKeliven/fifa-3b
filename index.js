//criar um servidor basico 
const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcrypt')
const pool = require('./db') //arquivo do banco de dados

app.use(express.json())

app.post('./register', async (req, res) => {
    const {usuario, email, senha} = req.body

    try {
        //verificar se o email ja foi cadastrado
        const emailExiste = await pool.query('SELECT * FROM usuarios WHERE email = $1', 
        [email])
        if (emailExiste.rows.length > 0) {
            return res.status(400).send('Email já cadastrado')
        }
        const senhaCripto = await bcrypt.hash(senha, 10)
        await pool.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)',
            [usuario, email, senhaCripto]
        )
        res.status(201).send('usuario criado com sucesso!')
    } catch (err){
        console.error(err.message)
        res.status(500).send('Erro no servidor')
    }
})

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)//crase
})