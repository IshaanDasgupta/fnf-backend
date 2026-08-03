import { ZodType, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidationSchema = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export function validate(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) req.body = schema.body.parse(req.body);

      if (schema.query)
        req.query = schema.query.parse(req.query) as Request["query"];

      if (schema.params)
        req.params = schema.params.parse(req.params) as Request["params"];

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        });
      }

      next(error);
    }
  };
}
