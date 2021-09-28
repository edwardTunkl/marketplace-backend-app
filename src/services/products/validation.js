import { checkSchema, validationResult } from "express-validator";

const schema = {
    name: {
        in: ["body"],
        isString: {
            errorMessage: "name validation failed, type must be string",
        }
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: "description validation failed, type must be string",
        }
    },
    brand: {
        in: ["body"],
        isString: {
            errorMessage: "brand validation failed type must be string",
        }
    },
    imageUrl: {
        in: ["body"],
        isString: {
            errorMessage: "imageUrl validation failed,type must be string",
        }
    },
    price: {
        in: ["body"],
        isNumeric: {
            errorMessage: "price validation failed,type must be string",
        }
    },
    category: {
        in: ["body"],
        isString: {
            errorMessage: "category validation failed,type must be string",
        }
    },
}

export const checkProductSchema = checkSchema(schema)

export const checkValidationResult = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const error = new Error("Product valdiation is failed")
        error.status = 400
        error.errors = errors.array()
        next(error)
    }
    next()
}