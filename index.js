import { getInput, setOutput } from "@actions/core";
import fetch from "node-fetch";

async function getWeather() {
  let api_key = getInput("API_KEY");
  let data = JSON.parse(getInput("DATA"));
  let output = {};
  let query = null;

  if (data && !!api_key) {
    data = Array.isArray(data) ? data : [data];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let id = item.id || i;
      if (item.longitude && item.latitude) {
        query = `lat=${item.latitude}&lon=${item.longitude}`;
      } else if (item.city && item.state) {
        query = `${item.city},${item.state}`;
      }
      if (query) {
        console.log(query);
        let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${api_key}`);
        if (res.ok) output[id] = await res.json();
      }
    }
  }

  console.log("output", output);
  setOutput("DATA", JSON.stringify(output));
}

getWeather();
