export const makeDraggable = (movable, endDrag) => {
  movable.interactive = true

  movable.on('mousedown', (e) => {
    e.stopPropagation()
    movable.dragging = true
    e.data.getLocalPosition(movable.parent)

    const position = e.data.getLocalPosition(movable.parent)
    movable.offsetX = movable.position.x - position.x
    movable.offsetY = movable.position.y - position.y
    //movable.position = e.data.getLocalPosition(movable.parent)
  })

  movable.on('mousemove', (e) => {
    if (movable.dragging) {
      e.stopPropagation()
      const position = e.data.getLocalPosition(movable.parent)
      movable.position.x = position.x + movable.offsetX
      movable.position.y = position.y + movable.offsetY
    }
  })

  const dragEnd = (e) => {
    e.stopPropagation()
    movable.dragging = false
    movable.data = null
    endDrag()
  }
  movable.on('mouseup', dragEnd)

  movable.on('mouseupoutside', dragEnd)
}