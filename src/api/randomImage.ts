// import axios from "axios";

const imageURL = 'https://source.unsplash.com/random/128x128'

const randPos = (min = 5, max = 850) => Math.floor(Math.random() * (max - min + 1)) + min
export const randomDriverImage = (pos = randPos()) => `${imageURL}?face?${pos}`
export const randomTruckImage = (pos = randPos()) => `${imageURL}?tractor?${pos}`
export const randomTrailerImage = (pos = randPos()) => `${imageURL}?trailer?${pos}`
// axios(`${imageURL}?${pos * 5}`,{
//   withCredentials: true})
//   .then((responce)=>{console.log(responce)})


