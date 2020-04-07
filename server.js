const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;

projectData = [];

const app = express();

/* Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('website'));

app.get('/all', getAllData)

app.post('/add', (req, res) => {
  projectData.push(req.body);
  res.json(projectData[projectData.length - 1]);
});

function getAllData(req, res) {  
  res.json(projectData);
}

app.listen(port, () => {
  console.info(`App listening on port ${port}`);
});