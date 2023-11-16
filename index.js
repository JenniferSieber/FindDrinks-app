// array of objects that will dynamically empty and fill based on user input and info received from api
let chosenDrinksArr = null
// output of search
const buttonSection = document.getElementById('buttonSection');
// drink details output
const drinkDisplayBox = document.querySelector('.drink-display')
const title = document.querySelector('.drink-title')
const like = document.querySelector('.like')
const heart = document.querySelector('.fa-heart')
const details = document.querySelector('.drink-details')
const instruct = document.querySelector('.drink-instructions')
const imgContainer = document.querySelector('.img-container')
const img = document.querySelector('.img')
const iframe = document.querySelector('iframe')
let drinkObj = []

// remove previous search results btns
function clearButtons() {
  while (buttonSection.firstChild) {
    buttonSection.removeChild(buttonSection.firstChild)
  }
}

// drink search event
buttonSection.addEventListener('click', (event) => {
  if (event.target.classList.contains('drinkBtn')) {
    const drinkName = event.target.getAttribute('data-drinkName');
    const drinkIndex = event.target.getAttribute('data-drinkIndex');

    // Assign drinkChoiceObject via user selection from drinks list array
    let drinkChoiceToDisplay = chosenDrinksArr[drinkIndex]
    displayDrinkInfo(drinkChoiceToDisplay)
  }
});

// get drinks List from API based on user input-find
function getDrinks() {
  // get user input
  const choice = document.querySelector('input').value

  //reset browser clear drink btns and prior drink displays
  clearButtons() 
  drinkDisplayBox.classList.add('hidden')
  drinkDisplayBox.classList.remove('background')
  like.classList.add('hidden')
  heart.classList.add('hidden')
  iframe.classList.add('hidden')
  iframe.setAttribute('src', '')
  img.classList.add('hidden')
  iframe.setAttribute('src', '')
  title.textContent = ''
  details.textContent = ''
  instruct.textContent = ''

  // assign API for fetch
  let url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${choice}`
  fetch(url)
    .then(res => res.json())
    .then(data => {
      // create drinks array of drink objects from api
      let drinksArr = data.drinks
      chosenDrinksArr = drinksArr
      // create a btn for each drink returned
      drinksArr.forEach((drink, i) => {
        let drinkName = drink.strDrink
        const drinkBtn = document.createElement('button')
        drinkBtn.classList.add('drinkBtn')
        drinkBtn.setAttribute('data-drinkName', drinkName);
        drinkBtn.setAttribute('data-drinkIndex', i);
        drinkBtn.textContent = drinkName
        buttonSection.appendChild(drinkBtn)   
      })     
    })
    .catch(err => {
      console.log(`Error: ${err}`)
    })    
}
//listener for user initial drink find calls getDrinks Fn
document.querySelector('.find').addEventListener('click', getDrinks)

// display drinkInfo selection from drink list btns displayed
function displayDrinkInfo(drink) {
  //remove the btns
  clearButtons()
  drinkObj.push(drink)
  // dynamically display drink header chosen
  drinkDisplayBox.classList.remove('hidden')
  drinkDisplayBox.classList.add('background')
  title.textContent = drink.strDrink
  like.classList.remove('hidden')
  heart.classList.remove('hidden')
  // check if api has video on the selectied drink-if so dynamically display by embedding to browser
  if (drink.strVideo !== null) {
    // get id at end of provided link to use with embed url
    let videoId = drink.strVideo.match(/(?:\?|&)v=([a-zA-Z0-9_-]{11})/)
    let embedUrl = `https://www.youtube.com/embed/${videoId[1]}`
    // console.log(embedUrl)
    iframe.classList.remove('hidden')
    iframe.setAttribute('src', embedUrl)
   }
   // dynamically display drink instructions
  instruct.textContent = `Instructions: ${drink.strInstructions}`
   // check if api has image(s) for the drink -dynamically display if available
  if (drink.strDrinkThumb) {
    const imgUrl = `${drink.strDrinkThumb}`
    img.classList.remove('hidden')
    img.setAttribute('src', drink.strDrinkThumb )
  } else {
    console.log('Image not found', drink)
  }
  details.textContent = `This ${drink.strAlcoholic.toLowerCase()} beverage is served in a ${drink.strGlass.toLowerCase()}.`
  // reset the drinks array for next search
  chosenDrinksArr = null 
}

