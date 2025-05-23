const express = require('express')
const router = express.Router()
const { addUnit } = require('../controllers/unitController')
const { validateNewUnit } = require('../validators/unitValidator')
const { hasRole, hasPermission } = require('../middleware/checkUserRole')

router.post('/add-unit', hasPermission("create:unit"), validateNewUnit, addUnit)

module.exports = router