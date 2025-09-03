// const express = require('express');
// const pool = require('../config/db');
// const router = express.Router();

// // Get all units
// router.get('/units', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM unit');
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get budgets for a specific unit
// router.get('/budgets/:unit_id', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM unit_budgets WHERE unit_id = $1',
//       [req.params.unit_id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get payments for a specific unit
// router.get('/payments/:unit_id', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM unit_payments WHERE unit_id = $1',
//       [req.params.unit_id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get cases for a specific unit
// router.get('/cases/:unit_id', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM unit_cases WHERE unit_id = $1',
//       [req.params.unit_id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get banks for a specific unit
// router.get('/banks/:unit_id', async (req, res) => {
//   try {
//     const result = await pool.query(
//       'SELECT * FROM unit_banks WHERE unit_id = $1',
//       [req.params.unit_id]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Get all units
router.get('/units', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM unit');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get budgets for a specific unit
router.get('/budgets/:unit_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM unit_budgets WHERE unit_id = $1',
      [req.params.unit_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payments for a specific unit
router.get('/payments/:unit_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM unit_payments WHERE unit_id = $1',
      [req.params.unit_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get cases for a specific unit
router.get('/cases/:unit_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM unit_cases WHERE unit_id = $1',
      [req.params.unit_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get banks for a specific unit
router.get('/banks/:unit_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM unit_banks WHERE unit_id = $1',
      [req.params.unit_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
