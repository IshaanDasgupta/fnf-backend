import { ZodError, ZodType } from "zod";
import { NextFunction, Request, Response } from "express";

type ValidationSchema = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export function validate(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        schema.body.parse(req.body);
      }

      if (schema.query) {
        schema.query.parse(req.query);
      }

      if (schema.params) {
        schema.params.parse(req.params);
      }

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
