const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('../frontend'));

// ... (keep existing GET/POST/DELETE)

// UPDATE student
app.put('/api/students/:id', (req, res) => {
  const { name, rollno, class: studentClass, subject1, subject2, subject3 } = req.body;
  const total = subject1 + subject2 + subject3;
  const percentage = (total / 300) * 100;
  const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'F';

  db.run(`UPDATE students SET name=?, rollno=?, class=?, subject1=?, subject2=?, subject3=?, total=?, percentage=?, grade=? WHERE id=?`,
    [name, rollno, studentClass, subject1, subject2, subject3, total, percentage, grade, req.params.id],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
});

// Search students
app.get('/api/students/search', (req, res) => {
  const { q, class: studentClass } = req.query;
  let query = 'SELECT * FROM students WHERE 1=1';
  let params = [];

  if (q) {
    query += ' AND (name LIKE ? OR rollno LIKE ?)';
    params.push(`%${q}%`, `%${q}%`);
  }
  if (studentClass) {
    query += ' AND class = ?';
    params.push(studentClass);
  }

  query += ' ORDER BY id DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Analytics
app.get('/api/analytics', (req, res) => {
  db.all(`
    SELECT 
      class,
      COUNT(*) as total,
      AVG(percentage) as avg_percentage,
      SUM(CASE WHEN grade = 'A' THEN 1 ELSE 0 END) as grade_A,
      SUM(CASE WHEN grade = 'B' THEN 1 ELSE 0 END) as grade_B,
      SUM(CASE WHEN grade IN ('C', 'F') THEN 1 ELSE 0 END) as failed
    FROM students 
    GROUP BY class
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Bulk delete
app.post('/api/students/bulk-delete', (req, res) => {
  const { ids } = req.body;
  db.run(`DELETE FROM students WHERE id IN (${ids.join(',')})`, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Enhanced Server running on http://localhost:${PORT}`);
});