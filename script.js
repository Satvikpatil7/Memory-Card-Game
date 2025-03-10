let images = [];
let selectedCards = [];
let matchedPairs = 0;
let count=0;
// Load sound effects (updated paths)
const flipSound = new Audio("Sound/flipSound.mp3");
const winSound = new Audio("Sound/winSound.mp3");
const matchSound = new Audio("Sound/matchSound.mp3");
// Fetch images
const fetchImages = async () => {
  try {
    images = [];

    for (let i = 0; i < 8; i++) {
      const response = await fetch(`https://picsum.photos/200/300?random=${i}`);
      images.push(response.url); // Store the image URL in the array
    }

    console.log(images);
    setupGames();
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

function setupGames() {
  let shuffledImages = [...images, ...images]; // Duplicate images for pairs
  shuffledImages.sort(() => Math.random() - 0.5); // Shuffle array

  const gameBoard = document.getElementById("game-board");

  if (!gameBoard) {
    console.error("Game board not found!");
    return;
  }

  gameBoard.innerHTML = ""; // Clear previous game

  shuffledImages.forEach((image) => {
    const card = document.createElement("button");
    card.classList.add("box");
    card.dataset.image = image;

    const img = document.createElement("img");
    img.src = image;
    img.style.display = "none"; // Initially hide the image

    card.appendChild(img);
    gameBoard.appendChild(card);

    card.addEventListener("click", handleCardClick);
  });
}

function handleCardClick(event) {
  const card = event.currentTarget;
  const img = card.querySelector("img");
  count++;
  console.log(`Clicked card ${count}`);
  if (selectedCards.length < 2 && !selectedCards.includes(card)) {
    img.style.display = "block";
    flipSound.play(); // Play flip sound
    selectedCards.push(card);
  }

  if (selectedCards.length === 2) {
    setTimeout(checkMatch, 1000);
  }
}

function checkMatch() {
  const [card1, card2] = selectedCards;

  if (card1.dataset.image === card2.dataset.image) {
    matchedPairs++;
    card1.style.pointerEvents = "none"; // Disable matched cards
    card2.style.pointerEvents = "none";
    matchSound.play(); // Play match sound
    if (matchedPairs === images.length) {
      winSound.play(); // Play win sound
      alert("Congratulations! You've won!\nTotal clicks: " + count);
    }
  } else {
    card1.querySelector("img").style.display = "none";
    card2.querySelector("img").style.display = "none";
  }

  selectedCards = [];
}

fetchImages();
