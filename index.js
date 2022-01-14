import {getInput,setOutput} from "@actions/core"
import fetch from "node-fetch";

async function getWeather(){

  let api_key = getInput('API_KEY')
  let coordinates = JSON.parse(getInput('COORDINATES'))
  let exclude = getInput('EXCLUDE')
  let arr = []

  if (!Array.isArray(coordinates)) coordinates = [coordinates]

  for (const c of coordinates){
    let lon = c.longitude || null
    let lat = c.latitude || null
    let id = c.id || null
    let obj = {}
    if (lon && lat){
      let query = `lat=${lat}&lon=${lon}&exclude=${exclude}&appid=${api_key}`
      let res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?${query}`)
      if (res.ok){
        obj.data = await res.json()
        if (id) obj.id = id
        arr.push(obj)
      }
    }
  }

  let output = arr.length == 1 ? arr[0] : arr

  console.log('output',output)
  setOutput('DATA', JSON.stringify(output));

}

getWeather()
