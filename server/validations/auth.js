import {body} from "express-validator"

export const registerValidation =[
    body("email", "Неверный формат почты").isEmail(),
    body("password","Пароль должен быть минимум 7 символов").isLength({min: 7}),
    body("fullName","Укажите имя").isLength({min: 3}),
    body("avatarUrl","Неверная ссылка на аватарку").optional().isString(),
]

export const loginValidation =[
    body("email", "Неверный формат почты").isEmail(),
    body("password","Пароль должен быть минимум 7 символов").isLength({min: 7}),
]

export const updateValidation = [
    body("fullName", "Укажите новое имя").isLength({min: 3}),
    body("email", "Неверный формат почты").isEmail(),
    body("avatarUrl","Неверная ссылка на аватарку").optional().isString(),

]