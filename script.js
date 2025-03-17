let images = [];
let selectedCards = [];
let matchedPairs = 0;
let count = 0;
const gameBoard = document.getElementById("game-board");
// Load sound effects (updated paths)
const flipSound = new Audio("Sound/flipSound.mp3");
const winSound = new Audio("Sound/winSound.mp3");
const matchSound = new Audio("Sound/matchSound.mp3");
// event
gameBoard.addEventListener("click", handleCardClick);
// Fetch images
const fetchImages = async () => {
  try {
    images = await Promise.all(
      Array.from({ length: 8 }, async (_, i) => {
        const response = await fetch(`https://picsum.photos/200/300?random=${i}`);
        return response.url; // Get the final image URL
      })
    );
    console.log(images);
    setupGame(); // Corrected function name
  } catch (error) {
    console.error("Error fetching images:", error);
  }
};

function setupGame() { // Corrected function name
  let shuffledImages = [...images, ...images]; // Duplicate images for pairs
  shuffledImages.sort(() => Math.random() - 0.5); // Shuffle array

  

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
  });

   // Event
}

function handleCardClick(event) {
  const card = event.target;//select
  const img = card.querySelector("img");
  count++;
  console.log(`Clicked card ${count}`); // Corrected console log syntax
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
      alert(`Congratulations! You've won!\nTotal clicks: ${count}`);
    }
  } else {
    card1.querySelector("img").style.display = "none";
    card2.querySelector("img").style.display = "none";
  }

  selectedCards = [];
}

fetchImages();
