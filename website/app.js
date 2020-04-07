/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=[YOUR_API_KEY_GOES_HERE]';

async function getWeather(url, zipCode, key) {
  let response = await fetch(url + zipCode + key);  
  try {
    if(response.status === 404) {
      alert(`No city found for zip code ${zipCode}`);
      return { 
        main: { 
          temp: '' 
        }
      };
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
}

document.querySelector('#generate').addEventListener('click', clickListener);

async function clickListener(event) {
  let zipCode = document.querySelector('#zip').value;
  if(!zipCode) {
    alert('You need to type a zip code :(');
    return;
  }

  getWeather(baseUrl, zipCode, apiKey)
    .then(res => {    
      let weatherDetails = {};

      let temp = res.main.temp;
      weatherDetails.temperature = temp;

      let feelings = document.querySelector('#feelings').value;
      weatherDetails.user_response = feelings;

      let newDate = new Date().toLocaleString();
      weatherDetails.date = newDate;

      return weatherDetails;
    }).then(weatherDetails => {
      return storeWeather('http://localhost:3000/add', weatherDetails);
    }).then(postResponse => {
      updateHTML();
    }).catch(err => {
      console.error(err);
    })
};

async function storeWeather(path, weatherParams) {
  let response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(weatherParams),
  });
  try {
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

async function updateHTML() {
  let res = await fetch('http://localhost:3000/all', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  try {
    let json = await res.json();
    
    let date = document.querySelector('#date');
    date.innerHTML = json.date;

    let temp = document.querySelector('#temp');
    temp.innerHTML = json.temperature;

    let content = document.querySelector('#content');
    content.innerHTML = json.user_response;
  } catch (error) {
    console.error(error);
  }
}

