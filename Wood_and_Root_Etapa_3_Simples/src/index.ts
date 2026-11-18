import login from "./index.html"
import home from "./home.html"
import db from "./db"

const loggedUsers: any = {}

const srv = Bun.serve({
    port: 3000,
    routes: {
        "/": login,
        "/home": home,

        "/api/products": {
            GET: () => {
                const products = db.query(`
                    SELECT id, name, description, price, category, image
                    FROM products
                    ORDER BY id
                `).all()
                return Response.json(products)
            }
        },

        "/api/personalizations": {
            POST: async (req) => {
                const ses = req.cookies.get("ses") as string
                const usuario = loggedUsers[ses]
                if (!ses || !usuario)
                    return Response.json({ msg: "Faça login para salvar uma personalização." }, { status: 401 })

                let body: any
                try {
                    body = await req.json()
                } catch {
                    return Response.json({ msg: "Dados inválidos." }, { status: 400 })
                }

                const productId = Number(body.productId)
                const woodType = String(body.woodType || "").trim()
                const color = String(body.color || "").trim()
                const design = String(body.design || "").trim()
                const dimensions = String(body.dimensions || "").trim()

                if (!productId || !woodType || !color || !design || !dimensions)
                    return Response.json({ msg: "Preencha todas as opções de personalização." }, { status: 400 })

                const product = db.query("SELECT id FROM products WHERE id = ?").get(productId)
                if (!product)
                    return Response.json({ msg: "Produto não encontrado." }, { status: 404 })

                // Valores adicionais demonstrativos para a funcionalidade de personalização.
                const woodPrices: Record<string, number> = { Pinus: 0, Carvalho: 200, Imbuia: 350 }
                const designPrices: Record<string, number> = { Simples: 0, Trabalhado: 150 }
                if (!(woodType in woodPrices) || !(design in designPrices))
                    return Response.json({ msg: "Opção de madeira ou design inválida." }, { status: 400 })

                const additionalPrice = woodPrices[woodType] + designPrices[design]
                const result = db.query(`
                    INSERT INTO personalizations
                    (user_id, product_id, wood_type, color, design, dimensions, additional_price)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `).run(usuario.id, productId, woodType, color, design, dimensions, additionalPrice)

                return Response.json({
                    id: Number(result.lastInsertRowid),
                    additionalPrice,
                    msg: "Personalização salva com sucesso."
                }, { status: 201 })
            }
        },

        "/user": {
            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`INSERT INTO users(username, password_hash) VALUES(:username, :password_hash)`)
                const hash = await Bun.password.hash(body.password)
                const data = query.run({ ":username": body.username, ":password_hash": hash })
                return Response.json(data)
            }
        },

        "/login": {
            POST: async (req) => {
                const body = await req.body?.json()
                const query = db.query(`SELECT * FROM users WHERE username=:username LIMIT 1`)
                const data: any = query.get({ ":username": body.username })
                if (!data)
                    return Response.json({ msg: "usuário não encontrado" }, { status: 404 })
                const hash = data.password_hash
                const isMatch = await Bun.password.verify(body.password, hash)
                if (!isMatch)
                    return Response.json({ msg: "senha incorreta" }, { status: 401 })
                const uuid = crypto.randomUUID()
                delete data.password_hash
                loggedUsers[uuid] = data
                req.cookies.set("ses", uuid)
                return Response.json(isMatch)
            }
        },

        "/login/user": (req) => {
            const ses = req.cookies.get("ses") as string
            const data = loggedUsers[ses]
            if (!ses || !data)
                return Response.json({ msg: "usuário não esta logado" }, { status: 401 })
            return Response.json(data)
        }
    }
})

console.log(`Server running on ${srv.url}`)