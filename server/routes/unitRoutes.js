const express = require('express')
const router = express.Router()
const { addUnit, assignUnit } = require('../controllers/unitController')
const { validateNewUnit, validateAssignUnit } = require('../validators/unitValidator')
const { hasPermission } = require('../middleware/checkUserRole')

router.post('/add-unit', validateNewUnit, addUnit)
router.post('/assign-unit', validateAssignUnit, assignUnit)

module.exports = router