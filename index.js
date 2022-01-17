import {getInput,setOutput} from "@actions/core"
import fetch from "node-fetch";

async function getWeather(){

  let api_key = getInput('API_KEY')
  let coordinates = getInput('COORDINATES')
  let cityState = getInput('CITY_STATE')
  let output = {}
  let props = {}

  if (cityState){
    cityState = JSON.parse(cityState)
    props.data = Array.isArray(cityState) ? cityState : [cityState]
    props.validate = (d)=> !!d.city
    props.query = (d) => d.state ? `${d.city},${d.state}` : `${d.city}`
  }

  if (coordinates){
    coordinates = JSON.parse(coordinates)
    props.data = Array.isArray(coordnates) ? coordnates : [coordnates]
    props.validate = (d) => d.latitude && d.longitude
    props.query = (d) => `lat=${d.latitude}&lon=${d.longitude}`
  }


  if (Object.keys(props).length > 0 && !!api_key){
    for (let i = 0; i < props.data.length;i++){
      if (props.validate(props.data[i])){
        let id = props.data.id || i
        let query = props.query(props.data[i])
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api_key}`)
        if (res.ok) output[id] = await res.json()
      }
    }
  }

  console.log('output',output)
  setOutput('DATA', JSON.stringify(output));


}

getWeather()
