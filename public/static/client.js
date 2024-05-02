let savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
let linksContainer = document.getElementById('linksContainer');
console.log(savedLinks)

if (Array.isArray(savedLinks)) {
	// First time log in
	console.log("Onboard first time log in")
} else if (savedLinks.links[0] === "") {
	// What to do if there are no links at all
	console.log("User deleted all links")
} else {
	savedLinks.links.forEach(link => {
		  let linkElement = document.createElement('a');
		  linkElement.href = link;
		  linkElement.textContent = link;
		  let liElement = document.createElement('li')
		  linksContainer.appendChild(liElement)
		  liElement.appendChild(linkElement);
	});
}
console.log('DOM added from client.js')

// Form add 
function addLink() {
	let link = document.getElementById("userLinkInput").value;
	let savedLinks = JSON.parse(localStorage.getItem('savedLinks')) || [];
	
	let linkElement = document.createElement('a');
	linkElement.href = link;
	linkElement.textContent = link;
	let liElement = document.createElement('li')
	linksContainer.appendChild(liElement)
	liElement.appendChild(linkElement);
	
	savedLinks.links.push(link)
	localStorage.setItem("savedLinks", JSON.stringify(savedLinks));
}

function clearAll() {
	let linksContainer = document.getElementById('linksContainer');
	localStorage.setItem("savedLinks", '{"links":[""]}')
	linksContainer.innerHTML = ""
}
