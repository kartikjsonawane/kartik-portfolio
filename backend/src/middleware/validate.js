/**
 * Generic request validator middleware factory
 * Usage: router.post('/', validate(schema), handler)
 */
export function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.safeParse?.(req.body) || {}
    if (error) return res.status(400).json({ error: error.message })
    next()
  }
}
