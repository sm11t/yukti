const pool = require('../config/db');

// POST /classes
// Expects:
// {
//   "class_name": "...",
//   "description": "...",
//   "syllabus": "..."
// }
exports.addClass = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { class_name, description, syllabus } = req.body;

    if (!class_name) {
      return res.status(400).json({ error: 'class_name is required.' });
    }

    const insertQuery = `
      INSERT INTO classes (user_id, class_name, description, syllabus)
      VALUES ($1, $2, $3, $4)
      RETURNING id, user_id, class_name, description, syllabus
    `;
    const values = [userId, class_name, description, syllabus];

    const result = await pool.query(insertQuery, values);
    const newClass = result.rows[0];

    return res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

exports.getUserClasses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(`
      SELECT id, class_name, description, syllabus
      FROM classes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};
