import {getInput,setOutput} from "@actions/core"
import fetch from "node-fetch";

async function getWeather(){

  let api_key = getInput('API_KEY')
  let coordinates = JSON.parse(getInput('COORDINATES'))
  let exclude = getInput('EXCLUDE')
  let output = {}
  let count = 0

  if (!Array.isArray(coordinates)) coordinates = [coordinates]

  for (const c of coordinates){
    let lon = c.longitude || null
    let lat = c.latitude || null
    let id = c.id || count
    let obj = {}
    if (lon && lat){
      let query = `lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${api_key}`
      let res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?${query}`)
      if (res.ok) output[id] = await res.json()
    }
    count++
  }

  console.log('output',output)
  setOutput('DATA', JSON.stringify(output));

}

getWeather()
