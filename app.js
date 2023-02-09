const gridElement = $('.container')
const foundPairsElement = $('.found-pairs')
const minutesElement = $('.minutes')
const secondsElement = $('.seconds')
const endPanelElement = $('.end-panel')
const resetButton = $('.reset-button')
const viewBoardButton = $('.view-board-button')

const correctSound = new Audio('./sounds/correct.mp3')
const victorySound = new Audio('./sounds/victory.mp3')

let numOfPairs = 21
numOfPairs = Math.abs(numOfPairs) > 21 ? 21 : Math.abs(numOfPairs)
let grid = shuffleArray(createGrid(numOfPairs))
let potentialPair = []
let pairsFound = 0
let isClickable = true
let timerRunning = false

resetButton.addEventListener('click', reset)
viewBoardButton.addEventListener('click', () => {
	endPanelElement.style.display = 'none'
})

function start() {
	grid.forEach((div) => {
		gridElement.append(div)
		div.addEventListener('click', async () => {
			if (!isClickable) return
			if (!timerRunning) {
				timerRunning = true
				// startTimer()
			}
			if (!div.classList.contains('hidden')) return
			div.classList.remove('hidden')
			potentialPair.push(div)
			if (potentialPair.length == 2) {
				if (!checkPair(potentialPair)) {
					isClickable = false
					await sleep(750)
					isClickable = true
					let [a, b] = potentialPair
					a.classList.toggle('hidden')
					b.classList.toggle('hidden')
				} else {
					pairsFound++
					if (pairsFound == numOfPairs) {
						victorySound.play()
						console.log(endPanelElement)
						endPanelElement.style.display = 'flex'
						console.log(endPanelElement)
					} else {
						foundPairsElement.textContent = pairsFound
						correctSound.play()
					}
				}
				potentialPair = []
			}
		})
	})
}

start()

function checkPair(pair) {
	return pair[0].classList[0] == pair[1].classList[0]
}

function createGrid(numOfPairs) {
	let gridArray = []
	for (let i = 1; i <= numOfPairs; i++) {
		for (let j = 0; j < 2; j++) {
			let div = document.createElement('div')
			div.classList.add(`pair-${i}`, 'hidden', 'card')
			let img = document.createElement('img')
			let num = i < 10 ? `0${i}` : i
			img.setAttribute('src', `./images/0${num}.png`)
			div.append(img)
			gridArray.push(div)
		}
	}
	return gridArray
}

function reset() {
	let children = Array.from(gridElement.children)
	children.forEach((child) => {
		if (child.classList.contains('card'))
			gridElement.removeChild(child)
	})
	grid = shuffleArray(createGrid(numOfPairs))
	pairsFound = 0
	timerRunning = false
	endPanelElement.style.display = 'none'
	start()
}

function startTimer() {
	let seconds = 0
	setInterval(() => {
		seconds++
		let sec = seconds % 60
		let min = Math.floor(seconds / 60)
		secondsElement.textContent = sec < 10 ? `0${sec}` : sec
		minutesElement.textContent = min < 10 ? `0${min}` : min
	}, 1000)
}

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

function $(element) {
	return document.querySelector(element)
}

function $$(element) {
	return document.querySelectorAll(element)
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
