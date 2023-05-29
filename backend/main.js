const express = require('express')
const cors = require('cors')
const PORT = 3000
const app = express()
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

app.use(express.json());
app.use(cors())

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', (err, database) => {
    res.json(database)
  });
})

app.post("/users", (req, res) => {
  const { name, age, game } = req.body;

  // exemplo de validação
  if(name.length < 5) {
    return res.status(422).json({
      error: 'name é muito pequeno'
    })
  }

  const stmt = db.prepare('INSERT INTO users(name, age, game) VALUES(?, ?, ?)')
  stmt.run(name, age, game)
  stmt.finalize();

  res.status(201).json({
    status: 'OK'
  })
});

app.patch("/users/:id", (req, res) => {
  const { name, age, game } = req.body;

  const stmt = db.prepare('UPDATE users SET name = ?, age = ?, game = ? WHERE id = ?')
  stmt.run(name, age, game, req.params.id)
  stmt.finalize();

  res.status(202).json({
    status: 'ok'
  })
});

app.delete("/users/:id", (req, res) => {
  db.run('DELETE FROM users WHERE id = ' + req.params.id)

  res.json({
    status: "OK"
  });
});



app.listen(PORT, () => {
  console.log('Running on port ' + PORT)
})