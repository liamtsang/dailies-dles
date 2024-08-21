function draggableMain() {
  const draggables = document.querySelectorAll('.draggable')
  const dropZone = document.getElementById('savedGamesContainer')
  let draggedElement = null
  let startTime;
  const clickThreshold = 1000;

  const dragDelay = 1000; // ms
  let touchTimeout;
  let isTouching = false;

  let initialX, initialY;
  let deltaY = 0;
  let hasScrolled = false
  let scrollThreshold = 75;
  let scrollInterval;
  const scrollSpeed = 50;

  let longPressTimer;
  let isLongPress = false;

  draggables.forEach((draggable) => {
    draggable.addEventListener('mousedown', dragStart)
    draggable.addEventListener('touchstart', touchStart, { passive: false})

  })

  document.addEventListener('mousemove', drag)
  document.addEventListener('touchmove', touchMove, {passive: false})

  document.addEventListener('mouseup', dragEnd)
  document.addEventListener('touchend', touchEnd)

  function touchStart(e) {
    startTime = new Date().getTime();
    draggedElement = this
    isLongPress = false
    isTouching = true;
    hasScrolled = false;
    initialX = e.touches[0].clientX
    initialY = e.touches[0].clientY

    longPressTimer = setTimeout(() => {
      draggedElement.style.touchAction = 'none';
      isLongPress = true;
    }, 500);
  }

  function touchMove(e) {
    if (!isTouching) return;
    deltaY = (e.touches[0].clientY- initialY);
    if (isLongPress) {
      drag(e);
    } else {
      if (Math.abs(deltaY) > 10) {
        hasScrolled = true;
        clearTimeout(longPressTimer);
        window.scrollBy(0, -deltaY/10);
        startY = e.touches[0].clientY;
      }
    }
  }

  function touchEnd(e) {
    clearTimeout(longPressTimer);
    if (isLongPress) {
      dragEnd(e)
    } else if (!isLongPress && !hasScrolled) {
      const link = e.target.dataset.link;
      if (link) {
        resetDraggedElement()
        window.open(link, '_blank')
      }
    } 
    isLongPress = false;
  }

  function dragStart(e) {
    startTime = new Date().getTime();
    e.preventDefault()
    draggedElement = this
    this.style.opacity = '0.5'
    if (e.type === 'touchstart') {
      initialX = e.touches[0].clientX;
      initialY = e.touches[0].clientY;
    } else {
      initialX = e.clientX;
      initialY = e.clientY;
    }
  }

  function drag(e) {
    e.preventDefault()
    if (!draggedElement) return

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
      deltaY =  e.clientY - initialY;
    }
    const windowHeight = window.innerHeight;

    draggedElement.style.animation = '0.2s infinite tilt-shaking'
    draggedElement.style.position = 'fixed'
    draggedElement.style.top = clientY - draggedElement.offsetHeight / 2 + 'px'
    draggedElement.style.left = clientX - draggedElement.offsetWidth / 2 + 'px'

    if (clientY < scrollThreshold) {
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          window.scrollTo(0, window.scrollY - scrollSpeed);
        }, 20);
      }
    } else if (clientY > windowHeight - scrollThreshold) {
      if (!scrollInterval) {
        scrollInterval = setInterval(() => {
          window.scrollTo(0, window.scrollY + scrollSpeed);
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
    deltaY = (e.clientY- initialY);
    const link = e.target.dataset.link;

    if (
      clientX > dropRect.left &&
      clientX < dropRect.right &&
      clientY > dropRect.top &&
      clientY < dropRect.bottom
    ) {
      runExistingScript(draggedElement)
      resetDraggedElement()
      return
    } else if (timeDiff < clickThreshold && Math.abs(deltaY) < 50 && link) {
      resetDraggedElement()
      window.open(link, '_blank');
    } else {
      resetDraggedElement()
    }
  }

  function resetDraggedElement() {
    draggedElement.style.position = 'static'
    draggedElement.style.opacity = '1'
    draggedElement.style.animation = 'none'
    draggedElement = null
    clearTimeout(longPressTimer)
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
