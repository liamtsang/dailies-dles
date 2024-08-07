function draggableMain() {
  const draggables = document.querySelectorAll('.draggable')
  const dropZone = document.getElementById('savedGamesContainer')
  let draggedElement = null

  draggables.forEach((draggable) => {
    draggable.addEventListener('mousedown', dragStart)
    draggable.addEventListener('touchstart', dragStart, { passive: false })
  })

  document.addEventListener('mousemove', drag)
  document.addEventListener('touchmove', drag, { passive: false })

  document.addEventListener('mouseup', dragEnd)
  document.addEventListener('touchend', dragEnd)

  function dragStart(e) {
    console.log('drag strated')
    e.preventDefault()
    draggedElement = this
    this.style.opacity = '0.5'
  }

  function drag(e) {
    if (!draggedElement) return

    const clientX = e.clientX || e.touches[0].clientX
    const clientY = e.clientY || e.touches[0].clientY

    draggedElement.style.position = 'fixed'
    draggedElement.style.top = clientY - draggedElement.offsetHeight / 2 + 'px'
    draggedElement.style.left = clientX - draggedElement.offsetWidth / 2 + 'px'
  }

  function dragEnd(e) {
    if (!draggedElement) return

    const dropRect = dropZone.getBoundingClientRect()
    const clientX = e.clientX || e.changedTouches[0].clientX
    const clientY = e.clientY || e.changedTouches[0].clientY

    if (
      clientX > dropRect.left &&
      clientX < dropRect.right &&
      clientY > dropRect.top &&
      clientY < dropRect.bottom
    ) {
      runExistingScript(draggedElement)
    }

    draggedElement.style.position = 'static'
    draggedElement.style.opacity = '1'
    draggedElement = null
  }

  function runExistingScript(itemInfo) {
    itemInfo.children[2].onclick.call()
  }
}

document.body.addEventListener('htmx:afterSettle', function (event) {
  if (event.detail.elt.className === 'category-gallery') {
    draggableMain()
  }
})
