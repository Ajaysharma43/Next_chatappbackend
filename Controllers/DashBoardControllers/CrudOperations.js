import pool from "../../Databaseconnection/DBConnection.js";
import bcrypt from 'bcrypt'

export const FindUser = async (req, res, next) => {
    try {
        const { formData } = req.body;
        const existed = await pool.query(`
        SELECT * FROM users
        WHERE id = $1
        `, [formData.id])
        if (existed.rowCount >= 1) {
            next()
        }
        else {
            res.status(404).json({ message: "user not found", Success: false })
        }
    } catch (error) {
        res.status(404).json({ error: error })
    }
}



export const UpdateUser = async (req, res, next) => {
    try {
        const { formData } = req.body;
        const UpdateUser = await pool.query(`
        UPDATE users
        SET name = $1 , phone = $2 , street = $3 , city = $4 , country = $5 , postal_code = $6 , roles = $7
        where id = $8 
        `, [formData.name, formData.phone, formData.street, formData.city, formData.country, formData.postal_code, formData.roles, formData.id])

        res.json({ message: "successfully updated", Success: true })
    } catch (error) {
        console.log(error)
        res.status(404).json({ error: error })
    }

}



export const DeleteUser = async (req, res, next) => {
    try {
        const { id } = req.query;
        console.log(`user id is ${id}`)
        const user = await pool.query(`
            SELECT * FROM users
            WHERE id = $1
            ` , [id])
        if (user.rowCount == 1) {
            const DeleteUser = await pool.query(`
                    DELETE FROM users
                    WHERE id = $1
                    `, [id])

            res.status(200).json({ message: "user is deleted", Success: true })
        }
        else {
            res.status(404).json({ message: "Failed to delete user", Success: false })
        }
    } catch (error) {
        res.status(404).json({ error: error })
    }
}


export const AddUser = async (req, res, next) => {
    try {
      const { UserData } = req.body;
  
      // Hash the password with bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(UserData.password, saltRounds);
  
      // Insert user into the database
      const result = await pool.query(
        `INSERT INTO users (name, email, phone, street, city, country, postal_code, password) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          UserData.name,
          UserData.email,
          UserData.phone,
          UserData.street,
          UserData.city,
          UserData.country,
          UserData.postal_code,
          hashedPassword, // Store the hashed password instead of plain text
        ]
      );
  
      res.status(201).json({ message: "User added successfully", user: result.rows , Success : true });
  
    } catch (error) {
      console.error("Error adding user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };