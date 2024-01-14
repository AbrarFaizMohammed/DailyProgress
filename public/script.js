var quotesArray = new Array(
  "Whatever you do you have to keep moving forward.",
  "Do not confuse motion and progress. A rocking horse keeps moving but does not make any progress.",
  "The moment a man ceases to progress, to grow higher, wider and deeper, then his life becomes stagnant.",
  "Always concentrate on how far you have come, rather than how far you have left to go. The difference in how easy it seems will amaze you."
);

let index = 0;
displayquotes();
function displayquotes() {
  
  if (index >= quotesArray.length - 1) {
    index = 0;
  }
  let quotetag = document.getElementById("quotetext");    
  console.log(quotetag)
  index++;
  quotetag.innerHTML = quotesArray[index];
  setTimeout(displayquotes, 6000);
}
