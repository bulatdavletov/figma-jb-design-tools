function makeSolidPaint({ r = 0, g = 0, b = 0, opacity = 1, variableId = null } = {}) {
  const paint = {
    type: 'SOLID',
    color: { r, g, b },
    opacity,
    visible: true,
  }

  if (variableId) {
    paint.boundVariables = { color: { id: variableId, type: 'VARIABLE_ALIAS' } }
  }

  return paint
}

module.exports = { makeSolidPaint }
