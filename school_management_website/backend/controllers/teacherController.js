const pool = require('../config/db');

// GET /api/teacher/me
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      'SELECT * FROM staff WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.json({ exists: false });
    }
    res.json({ exists: true, profile: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/teacher
exports.createProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      unit_id,
      staff_type,
      full_name,
      phone,
      email,
      qualification,
      designation,
      subject // Only for teaching staff; can be empty for non-teaching
    } = req.body;

    // prevent duplicate onboarding
    const exists = await pool.query('SELECT * FROM staff WHERE user_id = $1', [userId]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Profile already exists' });
    }

    await pool.query(
      'INSERT INTO staff (user_id, unit_id, staff_type, full_name, phone, email, qualification, designation, subject) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)',
      [userId, unit_id, staff_type, full_name, phone, email, qualification, designation, subject || null]
    );

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/teacher/students
exports.getStudents = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("LOG: Logged-in userId:", userId);

    // Get teacher's unit_id correctly (fix here: access first element in rows)
    const staff = await pool.query("SELECT unit_id FROM staff WHERE user_id = $1", [userId]);
    console.log("LOG: Staff record:", staff.rows);

    if (!staff.rows.length) return res.status(404).json({ error: "No teacher profile found." });

    const unitId = staff.rows[0].unit_id;
    console.log("LOG: unitId used for students query:", unitId);

    const students = await pool.query(
      `SELECT student_id, full_name, standard, division, roll_number, dob, gender, address, parent_name, parent_phone 
       FROM students WHERE unit_id = $1`,
      [unitId]
    );

    console.log("LOG: Students fetched:", students.rows);

    res.json(students.rows);
  } catch (err) {
    console.error("ERROR in getStudents:", err);
    res.status(500).json({ error: "Failed to fetch students." });
  }
};
exports.addStudent = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get the teacher's unit_id
    const staff = await pool.query("SELECT unit_id FROM staff WHERE user_id = $1", [userId]);
    if (!staff.rows.length) return res.status(404).json({ error: "No staff found." });
    const unitId = staff.rows[0].unit_id;
    const {
      full_name,
      standard,
      division,
      roll_number,
      dob,
      gender,
      address,
      parent_name,
      parent_phone
    } = req.body;
    const result = await pool.query(
      `INSERT INTO students (unit_id, full_name, standard, division, roll_number, dob, gender, address, parent_name, parent_phone)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [unitId, full_name, standard, division, roll_number, dob, gender, address, parent_name, parent_phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to add student." });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const studentId = req.params.student_id;
    const { full_name, standard, division, roll_number, dob, gender, address, parent_name, parent_phone } = req.body;
    // Optionally, verify teacher has permission for this student via unit_id
    await pool.query(
      `UPDATE students SET full_name=$1, standard=$2, division=$3, roll_number=$4, dob=$5,
        gender=$6, address=$7, parent_name=$8, parent_phone=$9 WHERE student_id=$10`,
      [full_name, standard, division, roll_number, dob, gender, address, parent_name, parent_phone, studentId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Update failed." });
  }
};


// PUT /api/teacher/:staff_id
exports.updateProfile = async (req, res) => {
  try {
    const staffId = req.params.staff_id;
    const userId = req.user.id;
    const {
      full_name,
      phone,
      email,
      qualification,
      designation,
      subject
    } = req.body;

    // Ownership check: only update own profile
    const match = await pool.query('SELECT * FROM staff WHERE staff_id = $1 AND user_id = $2', [staffId, userId]);
    if (!match.rows.length) {
      return res.status(403).json({ error: 'Unauthorized or profile not found' });
    }

    await pool.query(
      `UPDATE staff 
       SET full_name=$1, phone=$2, email=$3, qualification=$4, designation=$5, subject=$6, updatedAt=NOW()
       WHERE staff_id=$7`,
      [full_name, phone, email, qualification, designation, subject, staffId]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
