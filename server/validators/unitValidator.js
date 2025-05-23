const { body } = require('express-validator')

const validateNewUnit = [
    body("unitCode")
    .isLength({ min: 4 }).withMessage("Unit code cannot be less than 4 characters")
    .matches(/^[a-zA-Z0-9 ]+$/).withMessage("Unit code cannot contain symbols"),

    body("unitName")
    .isLength({ min: 5 }).withMessage("Unit Name cannot be less than 5 characters")
]

module.exports = { validateNewUnit }