import { useState, useEffect } from 'react';
import './App.css';
import Card from './components/Card';

function App() {
  const [timer, setTimer] = useState(100)
  const [GameOver, setGameOver] = useState(true)
  let startGame = timer==0 || timer==100 ? "Click here to start" : "Time is ticking"
  const [score, setScore] = useState(0)
  const [BestScore, setBestScore] = useState(0)
  const [cards, setCards] = useState([
    { 'src' : "Images/image1.gif" , matched: false},
    { 'src' : "Images/image2.webp", matched: false},
    { 'src' : "Images/image3.webp", matched: false},
    { 'src' : "Images/image4.png", matched: false},
    { 'src' : "Images/image5.jpg", matched: false},
    { 'src' : "Images/image6.jpg", matched: false},
    { 'src' : "Images/image1.gif", matched: false},
    { 'src' : "Images/image2.webp", matched: false},
    { 'src' : "Images/image3.webp", matched: false},
    { 'src' : "Images/image4.png", matched: false},
    { 'src' : "Images/image5.jpg", matched: false},
    { 'src' : "Images/image6.jpg", matched: false} 
  ])
  const [cardOne, setCardOne] = useState(null)  // Selected card one
  const [cardTwo, setCardTwo] = useState(null)  // Selected card two 

  const shuffleCards = () => {   // Shuffling the cards.
    reset()
    setCards(prevCards => prevCards.map(card => ({...card, matched: false})))  // Reset the matched to false.
    setCards(prevcards => prevcards.sort(() => Math.random() - 0.5))  // Random sort.
  }

  const selectedCard = (card) => {   
    if (!GameOver){
      cardOne && cardOne !== card ? setCardTwo(card) : setCardOne(card) // setCardTwo if cardOne is already selected.
    } 
    // We can't perform the comparsion here since the values of the useStates are not
    // updated instantly. Therefore we can use useEffect to compare the cards whenever cards are updated. 
  }

  const reset = () => {
    setCardOne(null)
    setCardTwo(null)
  }

  useEffect(() => {   // First render
    shuffleCards()  // Shuffling the cards for the first time when the page is loaded.
  }, [])

  useEffect(() => {
    if (BestScore < score){  // Updating the bestscore.
      setBestScore(score)
    }
  }, [score])

  useEffect(() => {
    // if (timer > 0){
    //   setTimeout(() => {
    //     setTimer(timer + 1)  // This code leads to memory asynchronous issues
    //   }, 1000)
    // }
    let intervalId;

    if (timer > 0 && timer < 100) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    }

    if(timer === 0) setGameOver(true);

    return () => {
      clearInterval(intervalId); // Clean up the interval on unmount to avoid memory leaks.
    };
  }, [timer]);

  useEffect(() => {  // Comparing the selected cards.
    if (cardTwo){ // The reason only cardTwo being checked is because if cardTwo is not null, cardOne is also not null (look at selectedCard function).
      if (cardOne.src === cardTwo.src){  // If both the cards are matched.
        setCards(prevcards => prevcards.map(card => {   
            if(card.src === cardOne.src){   // if cards are matched, modify the matched attribute to true.
              return {...card, matched: true}
            }
            else{
              return card
            }
          })
        )
      } 
      setTimeout(() => {  // Adding a delay to allow the card two to flip . 
        reset()     // Change the values of cards back to null.
      }, 500)
    }
    
  }, [cardTwo])   // This useEffect is rendered whenever cardTwo value is modified.

  useEffect(() => {
    let allMatched = true 
    cards.map(card => {if(!card.matched){
      allMatched = false
    }})
    if (allMatched){
      setGameOver(true)   
      setScore(timer)
      setTimer(100)
      // setBestScore(() => BestScore < score ? score : BestScore)
    }

  }, cards)

  const NewGame = () => {
    shuffleCards()
    setGameOver(false)
    setTimer(99)
    setScore(0)
  }

  return (
    <div className="game-container">
      <div className="title"><h1>Memory Game</h1></div>
      <div className='main-container'>
        <div className="score-container">
          <h1 className='startGame'>{startGame}</h1>
          <button onClick={NewGame}>New game</button>
          <h2>Score: {score}</h2>
          <h2>Best score: {BestScore}</h2>
        </div>
        <div className="card-container">
          {cards.map((card, index) => (
            <Card key={index}
              backImage = {card.src}
              handleClick = {() => selectedCard(card)}
              flipped = {cardOne === card || cardTwo == card || card.matched}
            />
          ))}
        </div>
        <div className="time-container">
        <h1>Time left: {timer}</h1>
        </div>
      </div>
    </div>
  );
}

export default App;
