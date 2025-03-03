const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 8000;

// เก็บ user
let users = []
let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection ({
        host: 'localhost',
        user:'root',
        password: 'root',
        database: 'webdb',
        port: 8830
    })
}


// path = get /users
app.get('/users', async(req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})

// path = POST / user
app.post('/user' , async(req, res) => {
     try{
        let user = req.body;
        const results =  await conn.query('INSERT INTO users SET ?', users)
        res.json({
            message: 'User created',
            data: results[0]
        })
     } catch (error) {
        console.error('errorMessage',error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
     }
})
// path = get /users
app.get('/users/:id', async(req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        if (results[0].length > 0 ) {
            throw {statusCode: 404, message: 'User not found'}
        }
        res.json(results[0][0])
    } catch (error) {
        console.error('errorMessage',error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })

    }
})

//path = put /user/ : id
app.put('/user/:id', async (req, res) => {
    let.id = req.params.id;
    let updateUser = req.body;
    try{
        let.id = req.params.id;
        let updateUser = req.body;
        const results = await conn.query(
        'UPDATE users SET ? WHERE, id = ?',
        [updateUser, id]
    )
        res.json({
            message: "Update User Completed",
            data: results[0]
        })
    } catch (error) {
        console.error('errorMessage',error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })

    }

    res.json({
        message: "User updated",
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
      }
    });
})

app.delete('/user/:id', async(req, res) => {
    try{
        let.id = req.params.id;
        const results = await conn.query('DELETE From users WHERE id = ?' , id)
        res.json({
            message: 'Delete User Completed',
            data: results[0]
        })
    
    } catch (error) {
        console.error('errorMessage',error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})

app.listen(port, async() => {
    await initMySQL()
    console.log(`Server is running on port ${port}`);
});
