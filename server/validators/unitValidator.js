const { body } = require('express-validator')

const validateNewUnit = [
    body("unitCode")
    .exists().withMessage("Unit Code missing")
    .isLength({ min: 4, max: 10 }).withMessage("Unit code must be between 4 and 10 characters")
    .matches(/^[a-zA-Z0-9 ]+$/).withMessage("Unit code cannot contain symbols"),

    body("unitName")
    .exists().withMessage("Unit Name missing")
    .isLength({ min: 5, max: 50 }).withMessage("Unit Name must be between 5 and 50 characters")
]

module.exports = { validateNewUnit }