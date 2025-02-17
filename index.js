const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

app.use(bodyParser.json());
const port = 8000;

// เก็บ user
let users = []
let counter = 1
let conn = null

/*
Get /users  สำหรับ user  ทั้งหมด
POST /user สำหรับสร้าง user ใหม่บันทึกเข้าไป
GET /user/:id สำหรับดูข้อมูล user ที่มี id ตามที่ระบุ
PUT /user/:id สำหรับแก้ไข user ที่มี id ตามที่ระบุ
DELETE /user/:id สำหรับลบ user ที่มี id ตามที่ระบุ
*/
const initMySQL = async () => {
     conn = await mysql.createConnection({
        host: 'localhost',
        user:'root',
        password: 'root',
        database: 'webdb'
        port: 8830
     })
}
app.get('/testdb', (req, res) => {
    mysql.createConnection({
        host: 'localhost',
        user:'root',
        password: 'root',
        database: 'webdb',
        port: 8830
    }).then((conn) => {
        conn
        .query('SELECT * FROM users')
        .then((results) => {
            res.json(results[0])
        })
        .catch((error) => {
            console.log('Error fetching users:', error.message)
            res.status(500).json({error: 'Error fetching users'})
        })
    })
})    

// path = get /users
app.get('/users', (req, res) => {
    res.json(users);
})

// path = POST / user สำหรับ
app.post('/user' , (req, res) => {
    let user = req.body;
    const results =  conn.query('INSERT INTO users SET ?', users)
    console.log('results', results)
    res.json({
        message: "User created",
        data: results[0]
    });
})


//path = put /user/ : id
app.put('/user/:id', (req, res) => {
    let.id = req.params.id;
    let updateUser = req.body;
    // หา index ของ user ที่ต้องการ update
    let selectedIndex = users.findIndex(user => user.id == id)
    //  update user
    if (updateUser.firstname) {
        users[selectedIndex].firstname = updateUser.firstname
    }

    if (updateUser.lastname) {
        users[selectedIndex].lastname = updateUser.lastname
    }

    res.json({
        message: "User updated",
        data: {
            user: updateUser,
            indexUpdate: selectedIndex
      }
    });
})


app.delete('/user/:id', (req, res) => {
    let id = req.params.id;

    let selectedIndex = users.findIndex(user => user.id == id)

        users.splice(selectedIndex, 1)
        res.json({
            message: "Delete Completed",
            indexDelete: selectedIndex
     });
})
 

app.listen(port, async (req, res) => {
    await initMsSQL()
    console.log('server is running on port' + port);
});