// Globals
const savedLinksConstructor = () =>
  JSON.parse(localStorage.getItem('savedLinks')) || []
const savedGamesContainer = () => document.getElementById('savedGamesContainer')

// Init
function init() {
  let savedLinks = savedLinksConstructor()
  if (Array.isArray(savedLinks)) {
    // First time log in
    console.log('Onboard first time log in')
    localStorage.setItem('savedLinks', '{"links":[]}')
  } else if (!savedLinks.links) {
    // What to do if there are no links at all
    console.log('User deleted all links')
    console.log(savedLinks)
  } else {
    let i = 0
    savedLinks.links.forEach((game) => {
      i++
      buildLinkHTML(game.link, game.title, i)
    })
  }
}

// Helpers
function buildLinkHTML(link, title, i) {
  let linkElement = document.createElement('a')
  let deleteElement = document.createElement('button')
  let deleteImg = document.createElement('img')
  let liElement = document.createElement('li')
  let imageElement = document.createElement('img')

  imageElement.src = `http://www.google.com/s2/favicons?domain=${link}&sz=256`
  linkElement.href = link
  linkElement.target = '_blank'
  linkElement.textContent = title
  liElement.className = 'savedGameItem'
  deleteImg.onClick = function (event) {
    event.stopPropagation();
    event.preventDefault();
    removeLink(liElement, link)
  }
  deleteImg.className = 'deleteButton'
  deleteImg.src= '/static/trash.svg'

  savedGamesContainer().appendChild(liElement)
  liElement.appendChild(imageElement)
  liElement.appendChild(linkElement)
  liElement.appendChild(deleteImg)
}

function addGametoLocalStorage(link, title) {
  let savedLinks = savedLinksConstructor()
  if (savedLinks.links)
    savedLinks.links.push({ link: link, title: title})
  localStorage.setItem('savedLinks', JSON.stringify(savedLinks))
}

// Main functions called in HTML
function addLink() {
  let link = document.getElementById('userLinkInput').value
  let title = document.getElementById('userTitleInput').value
  buildLinkHTML(link, title)
  addGametoLocalStorage(link)
}

function addLinkFromSearch(link, title) {
  buildLinkHTML(link, title)
  addGametoLocalStorage(link, title)
}

function removeLink(element, link) {
  let savedLinks = savedLinksConstructor()
  element.remove()
  const index = savedLinks.links.findIndex((l) => l === link)
  savedLinks.links.splice(index, 1)
  localStorage.setItem('savedLinks', JSON.stringify(savedLinks))
}

function clearAll() {
  localStorage.setItem('savedLinks', '{"links":[]}')
  savedGamesContainer().innerHTML = ''
}

function openLinks() {
  let savedLinks = savedGamesContainer()
  let length = savedLinks.children.length

  for (let i = length - 1; i >= 0; i--) {
    let url = savedGamesContainer().children[i].childNodes[1].href
    window.open(url, '_blank')
  }
}

// Set li items pointer-events: none
function toggleEdit() {
  let deleteButtons = document.getElementsByClassName('deleteButton')
  let liElements = document.getElementsByClassName('savedGameItem')
  let editButton = document.getElementById('edit-button')
  if (!deleteButtons[0]) return 

  if (deleteButtons[0].style.opacity == 0) {
    for (let i=0; i<deleteButtons.length; i++) {
      deleteButtons[i].style.setProperty('opacity', 1)
      deleteButtons[i].style.setProperty('z-index', 999)
      deleteButtons[i].style.setProperty('pointer-events', 'auto')
    }
    for (let i=0; i<liElements.length; i++) {
      liElements[i].style.setProperty('pointer-events', 'none')
    }
    editButton.style.setProperty('filter', 'invert(59%) sepia(94%) saturate(377%) hue-rotate(82deg) brightness(91%) contrast(86%)')
  } else {
    for (let i=0; i<deleteButtons.length; i++) {
      deleteButtons[i].style.setProperty('opacity', 0)
      deleteButtons[i].style.setProperty('z-index', 1)
      deleteButtons[i].style.setProperty('pointer-events', 'none')
    }
    for (let i=0; i<liElements.length; i++) {
      liElements[i].style.setProperty('pointer-events', 'auto')
    }
    editButton.style.setProperty('filter', 'invert(.8)')
  }
}

init()

// Functions for the category search
// =================================

function allOtherColors(color) {
  let categories = ['red','orange','yellow','cyan','blue','purple','green']
  switch (color) {
    case 'red':
      return filteredArray = categories.filter(e => e !== 'red')
    case 'orange':
      return filteorangeArray = categories.filter(e => e !== 'orange')
    case 'yellow':
      return filteyellowArray = categories.filter(e => e !== 'yellow')
    case 'cyan':
      return filtecyanArray = categories.filter(e => e !== 'cyan')
    case 'blue':
      return filteblueArray = categories.filter(e => e !== 'blue')
    case 'purple':
      return filtepurpleArray = categories.filter(e => e !== 'purple')
    case 'green':
      return filtegreenArray = categories.filter(e => e !== 'green')
  }
}

let selectedColors = []

function selectColor(color) {
  const key = document.getElementById(color + '-key')
  const root = document.querySelector(':root')
  const properties = allOtherColors(color)

  if (selectedColors.includes(color)) {
    selectedColors = selectedColors.filter(e => e !== color)
    // Reset to neutral
    key.style.fontWeight = 'normal'
    key.style.color = 'rgb(140, 140, 140)'
    if (selectedColors.length == 0) { 
      properties.forEach((eachColor) => {
        root.style.setProperty(`--${eachColor}-display`,'flex')
      })
    // Hide just this color
    } else {
      key.style.fontWeight = 'normal'
      key.style.color = 'rgb(140, 140, 140)'
      root.style.setProperty(`--${color}-display`,'none')
    }
    return
  // Display selected color and hide all others
  } else {
    root.style.setProperty(`--${color}-display`,'flex')
    key.style.fontWeight = 'bold'
    key.style.color = 'rgb(28, 28, 28)'
    properties.forEach((eachColor) => {
      if (!selectedColors.includes(eachColor)) {
        root.style.setProperty(`--${eachColor}-display`,'none')
      }
    })
    selectedColors.push(color)
  }
}

function clientSideSearch(event) {
  const startTime = Date.now() // Benchmark
  const input = event.target[0].value
  const categoryGallery = document.getElementById('category-gallery')
  if (input == '') {
    for (let i=0; i<categoryGallery.children.length;i++) {
      categoryGallery.children[i].style.display = 'flex';
    }
    return
  }

  // -1 for vite thing (might be bad on prod)
  for (let i=0; i<categoryGallery.children.length;i++) {
    if (!categoryGallery.children[i].dataset.title.toLowerCase().startsWith(input.toLowerCase())) {
      categoryGallery.children[i].style.display = 'none';
    }
  }
}

