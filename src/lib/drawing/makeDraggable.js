export const makeDraggable = (movable) => {
  movable.interactive = true

  movable.on('mousedown', (e) => {
    e.stopPropagation()
    movable.dragging = true
    e.data.getLocalPosition(movable.parent)

    const position = e.data.getLocalPosition(movable)
    movable.pivot.set(position.x, position.y)
    movable.position = e.data.getLocalPosition(movable.parent)
  })

  movable.on('mousemove', (e) => {
    if (movable.dragging) {
      e.stopPropagation()
      movable.position = e.data.getLocalPosition(movable.parent)
    }
  })

  movable.on('mouseup', (e) => {
    e.stopPropagation()
    movable.dragging = false
    movable.data = null
  })

  movable.on('mouseupoutside', (e) => {
    e.stopPropagation()
    movable.dragging = false
    movable.data = null
  })
}