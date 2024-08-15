function draggableMain() {
  const draggables = document.querySelectorAll('.draggable')
  const dropZone = document.getElementById('savedGamesContainer')
  let draggedElement = null
  let startTime;
  const clickThreshold = 1000;

  let initialX, initialY;
  let xOffset = 0, yOffset = 0;
  let scrollThreshold = 75;
  let scrollInterval;
  const scrollSpeed = 50;

  draggables.forEach((draggable) => {
    draggable.addEventListener('mousedown', dragStart)
    draggable.addEventListener('touchstart', dragStart, { passive: false })
  })

  document.addEventListener('mousemove', drag)
  document.addEventListener('touchmove', drag, { passive: false })

  document.addEventListener('mouseup', dragEnd)
  document.addEventListener('touchend', dragEnd)

  function dragStart(e) {
    startTime = new Date().getTime();
    e.preventDefault()
    draggedElement = this
    this.style.opacity = '0.5'
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX - xOffset;
      initialY = e.touches[0].clientY - yOffset;
    } else {
      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
    }
  }

  function drag(e) {
    if (!draggedElement) return

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const windowHeight = window.innerHeight;

    draggedElement.style.position = 'fixed'
    draggedElement.style.top = clientY - draggedElement.offsetHeight / 2 + 'px'
    draggedElement.style.left = clientX - draggedElement.offsetWidth / 2 + 'px'

    if (clientY < scrollThreshold) {
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          window.scrollTo(0, window.scrollY - scrollSpeed);
          yOffset += scrollSpeed;
        }, 20);
      }
    } else if (clientY > windowHeight - scrollThreshold) {
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          window.scrollTo(0, window.scrollY + scrollSpeed);
          yOffset -= scrollSpeed;
        }, 20);
      }
    } else {
      clearInterval(scrollInterval);
      scrollInterval = null;
    }
  }

  function dragEnd(e) {
    const endTime = new Date().getTime();
    const timeDiff = endTime - startTime;
    clearInterval(scrollInterval);
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
      draggedElement.style.position = 'static'
      draggedElement.style.opacity = '1'
      draggedElement = null
      return
    }

    if (timeDiff < clickThreshold) {
      const link = e.target.dataset.link;
      if (link) {
          window.open(link, '_blank');
      }
    }

    draggedElement.style.position = 'static'
    draggedElement.style.opacity = '1'
    draggedElement = null
  }

  function runExistingScript(itemInfo) {
    if (!itemInfo.children) return
    itemInfo.children[2].onclick.call()
  }
}

document.body.addEventListener('htmx:afterSettle', function (event) {
  if (event.detail.elt.id === 'category-gallery') {
    draggableMain()
  }
})
