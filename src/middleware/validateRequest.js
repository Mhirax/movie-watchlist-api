export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({ message: flatErrors.join(", ") });
    }

    // Replace the raw body with Zod's parsed output so controllers get the
    // cleaned values (trimmed/lowercased strings, coerced numbers) and no
    // fields that aren't in the schema.
    req.body = result.data;
    next();
  };
};
