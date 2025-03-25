import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL

const pool = new Pool({
    connectionString,
});

(async () => {
    try {
        const client = await pool.connect();
        console.log("✅ Connected to PostgreSQL");
        client.release(); 
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
})();

export default pool;
