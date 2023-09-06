import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3001;
const key = "82005d27a116c2880c8f0fcb866998a0";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

let lat;
let lon;
let currentWeather;

app.get('/', (req, res) => {
  res.render('index.ejs',{content: currentWeather});
});

app.post('/send-location', async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    lat = latitude;
    lon = longitude;
    
    console.log(`Received location: Latitude ${latitude}, Longitude ${longitude}`);
    
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`);
    
    if (response.status === 200) {
      currentWeather = response.data;
      res.redirect('/weather');
    } else {
      console.error('Error fetching weather data from OpenWeatherMap API');
      res.status(500).send('Error fetching weather data');
    }
  } catch (error) {
    console.error('Error sending location or fetching weather data:', error);
    res.status(500).send('Error sending location or fetching weather data');
  }
});

app.get('/weather', (req, res) => {
  res.render('index.ejs', { content: currentWeather });
  console.log(currentWeather);
});

app.post('/city-weather', async (req, res) => {
  try {
    console.log(req.body);
    const { city } = req.body;
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
    currentWeather=response.data;
    res.redirect('/weather');
  } catch (error) {
    console.error('Error sending location or fetching weather data:', error);
    res.status(500).send('Error sending location or fetching weather data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
