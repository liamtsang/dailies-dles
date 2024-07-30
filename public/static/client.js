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
      buildLinkHTML(game.link, game.title, game.image, i)
    })
  }
}

// Helpers
function buildLinkHTML(link, title, image, i) {
  let linkElement = document.createElement('a')
  let deleteElement = document.createElement('button')
  let liElement = document.createElement('li')
  let imageElement = document.createElement('img')

  imageElement.src = image
  linkElement.href = link
  linkElement.target = '_blank'
  linkElement.textContent = title
  liElement.style = '--i: ' + i
  deleteElement.onclick = function () {
    removeLink(liElement, link)
  }
  deleteElement.textContent = 'Delete'
  deleteElement.id = 'deleteButton'

  savedGamesContainer().appendChild(liElement)
  liElement.appendChild(imageElement)
  liElement.appendChild(linkElement)
  liElement.appendChild(deleteElement)
}

function addGametoLocalStorage(link, title, image) {
  let savedLinks = savedLinksConstructor()
  if (savedLinks.links)
    savedLinks.links.push({ link: link, title: title, image: image })
  localStorage.setItem('savedLinks', JSON.stringify(savedLinks))
}

// Main functions called in HTML
function addLink() {
  let link = document.getElementById('userLinkInput').value
  let title = document.getElementById('userTitleInput').value
  buildLinkHTML(link, title)
  addGametoLocalStorage(link)
}

function addLinkFromSearch(link, title, image) {
  buildLinkHTML(link, title, image)
  addGametoLocalStorage(link, title, image)
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

init()
