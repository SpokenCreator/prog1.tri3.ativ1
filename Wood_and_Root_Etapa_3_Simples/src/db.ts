import { Database } from "bun:sqlite"

const db = new Database("database.sqlite")

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS personalizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        wood_type TEXT NOT NULL,
        color TEXT NOT NULL,
        design TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        additional_price REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    );
`)

// Produtos iniciais para que o catálogo já apareça na primeira execução.
const productCount = db.query("SELECT COUNT(*) AS total FROM products").get() as { total: number }

if (productCount.total === 0) {
    const insertProduct = db.query(`
        INSERT INTO products (name, description, price, category, image)
        VALUES (:name, :description, :price, :category, :image)
    `)

    const products = [
        {
            name: "Mesa de Jantar Aurora",
            description: "Mesa elegante em madeira maciça, ideal para reunir a família.",
            price: 1890,
            category: "Mesas",
            image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0"
        },
        {
            name: "Cadeira Nórdica",
            description: "Design minimalista com acabamento natural e confortável.",
            price: 590,
            category: "Cadeiras",
            image: "https://images.unsplash.com/photo-1503602642458-232111445657"
        },
        {
            name: "Estante Raiz",
            description: "Estante versátil para organizar livros e objetos decorativos.",
            price: 1290,
            category: "Estantes",
            image: "https://images.unsplash.com/photo-1594620302200-9a762244a156"
        },
        {
            name: "Aparador Ipê",
            description: "Aparador contemporâneo com linhas simples e madeira selecionada.",
            price: 1490,
            category: "Aparadores",
            image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2"
        }
    ]

    for (const product of products) {
        insertProduct.run({
            ":name": product.name,
            ":description": product.description,
            ":price": product.price,
            ":category": product.category,
            ":image": product.image
        })
    }
}

export { db }
export default db
