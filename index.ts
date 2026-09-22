//            BANCO DE DADOS     HTTP
// [C]reat    insert             post
// [R]read    select             get
// [U]pdate   update             put
// [U]pdate   update             patch
// [D]elete   delete             delete

import { db } from "./db"

const srv = Bun.serve({
    port: 3000,
    routes: {
        "/user": {
            GET: () => {
                const query = db.query(`SELECT * FROM users`)
                const data = query.all()
                return Response.json(data)
            },

            POST: async (req) => {
                const body = await req.body.json()
                const query = db.query(`
                    INSERT INTO users(username, email, password_hash)
                    VALUES(:username, :email, :password_hash)
                `)
                const dbResp = query.run({
                    ':username': body.username,
                    ':email': body.email,
                    ':password_hash': body.password
                })
                return Response.json({
                    "message": "deu boa garote!",
                    dbResp
                })
            },
        },

        "/user/:id": {
            GET: (req) => {
                const id = req.params.id
                const query = db.query(`SELECT * FROM users WHERE id=:id`)
                const data = query.get({ ':id': id })
                return Response.json(data)
            },

            PUT: async(req) => {
                const body = await req.body.json()
                const query = db.query(`UPDATE users SET username = :username, email = :email, password_hash = :password WHERE id = :id`)
                const dbResp = query.run({
                    ':username': body.username,
                    ':email': body.email,
                    ':password': body.password,
                    ':id': req.params.id
                })
                return Response.json(dbResp)
            },

            DELETE: (req) => {
                const query = db.query(`DELETE FROM users WHERE id=:id`)
                const data = query.run({ ':id': req.params.id })
                return Response.json(data)
            },
        },

        "/produtos": {
            GET: () => {
                const query = db.query(`SELECT * FROM produtos`)
                const data = query.all()
                return Response.json(data)
            },

            POST: async (req) => {
                const body = await req.body.json()
                const query = db.query(`
                    INSERT INTO users(nome, descricao, preco, tipo, disponibilidade)
                    VALUES(:id_produto, :nome, :descricao, :preco, :tipo, :disponibilidade)
                `)
                const dbResp = query.run({
                    ':nome': body.nome,
                    ':descricao': body.descricao,
                    'preco': body.preco,
                    ':tipo': body.tipo,
                    ':disponibilidade': body.disponibilidade
                })
                return Response.json({
                    "message": "deu boa garote!",
                    dbResp
                })
            },
        },

        "/produtos/:id": {
            GET: (req) => {
                const id = req.params.id
                const query = db.query(`SELECT * FROM produtos WHERE id=:id`)
                const data = query.get({ ':id': id })
                return Response.json(data)
            },

            PUT: async(req) => {
                const body = await req.body.json()
                const query = db.query(`UPDATE produtos SET nome = :nome, descricao = :preco, tipo = :tipo, disponibilidade = :disponibilidade WHERE id = :id`)
                const dbResp = query.run({
                    ':nome': body.nome,
                    ':descricao': body.descricao,
                    'preco': body.preco,
                    ':tipo': body.tipo,
                    ':disponibilidade': body.disponibilidade,
                    ':id': req.params.id
                })
                return Response.json(dbResp)
            },

            DELETE: (req) => {
                const query = db.query(`DELETE FROM produtos WHERE id=:id`)
                const data = query.run({ ':id': req.params.id })
                return Response.json(data)
            },
        },
    }
})

console.log(`Servidor em ${srv.url}`)