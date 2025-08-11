import 'dotenv/config'; 

export const config = {
    port: process.env.PORT || 8000,
    dbUrl: process.env.DB_URL || 'http://localhost:8000/',
}
