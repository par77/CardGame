import React from 'react'
import '../App.css'

function Card(props) {
  const flipped = props.flipped ? `card flipped` : "card"
  return (
    <div className={flipped} onClick={props.handleClick}> 
      <img className = "front" src="../Images/cover.jpg" />
      <img className="back" src={props.backImage} />
    </div>
  )
}

export default Card