// Globals
const savedLinksConstructor = () => JSON.parse(localStorage.getItem('savedLinks')) || [];
const linksContainer = () => document.getElementById('linksContainer');

// Init
function init() {
	let savedLinks = savedLinksConstructor();
	if (Array.isArray(savedLinks)) {
		// First time log in
		console.log("Onboard first time log in")
		localStorage.setItem("savedLinks", '{"links":[]}')
	} else if (!savedLinks.links) {
		// What to do if there are no links at all
		console.log("User deleted all links")
		console.log(savedLinks)
	} else {
		savedLinks.links.forEach(link => {
			buildLinkHTML(link)
		});
	}
}

// Helpers
function buildLinkHTML(link) {
	let linkElement = document.createElement('a');
	let deleteElement = document.createElement('button')
	let liElement = document.createElement('li')

	linkElement.href = link;
	linkElement.textContent = link;
	deleteElement.onclick = function() {removeLink(liElement,link)}
	deleteElement.textContent = 'Delete'

	linksContainer().appendChild(liElement)
	liElement.appendChild(deleteElement)
	liElement.appendChild(linkElement)
}

function addLinkToLocalStorage(link) {
	let savedLinks = savedLinksConstructor();
	if (savedLinks.links) savedLinks.links.push(link)
	localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
}

// Do stuff functions
function addLink() {
	let link = document.getElementById("userLinkInput").value;
	buildLinkHTML(link)
	addLinkToLocalStorage(link)
}

function addLinkFromSearch(link) {
	buildLinkHTML(link)
	addLinkToLocalStorage(link)
}

function removeLink(element, link) {
	let savedLinks = savedLinksConstructor();
	element.remove()
	const index = savedLinks.links.findIndex((l) => l === link )
	savedLinks.links.splice(index,1)
	localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
}

function clearAll() {
	localStorage.setItem("savedLinks", '{"links":[]}')
	linksContainer().innerHTML = ""
}

function openLinks() {
	let length = linksContainer().children.length

	for (let i=length-1; i>=0; i--) {
		let url = linksContainer().children[i].childNodes[0].href
		window.open(url, '_blank')
	}
}

init()
