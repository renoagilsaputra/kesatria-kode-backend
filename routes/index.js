const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/covid19', async (req, res) => {
  const apiURL = process.env.API_URL;
  const xApiKey = process.env.X_API_KEY;
  
  const response = await axios.get(apiURL, {
    headers: {
      'x-api-key': xApiKey,
    },
    params: {
      country: 'Indonesia',
    },
  });

  if (response.status == 200) {
    const data = response.data;

    if (data.length == 0) {
      return res.status(404).json({
        message: 'Data not found',
      });
    }

    const object = data[0]['cases'];
    const keys = Object.keys(object);
    const tempArray = [];

    keys.map((item) => { 
      tempArray.push({
        date: item,
        new: object[item]['new'],
        total: object[item]['total']
      });
    });

    const sumTotalCase = tempArray.reduce((accumulator, currentValue) => accumulator + currentValue['total'], 0);
    const sumNewCase = tempArray.reduce((accumulator, currentValue) => accumulator + currentValue['new'], 0);
    
    const dataTotalCase = tempArray.map((item) => {
      return {
        date: item['date'],
        data: item['total']
      }
    });

    const dataNewCase = tempArray.map((item) => {
      return {
        date: item['date'],
        data: item['new']
      }
    });
    

    return res.status(200).json({
      sumTotalCase,
      sumNewCase,
      dataTotalCase,
      dataNewCase
    });
  } else {
    return res.status(response.status).json({
      message: 'Error',
    });
  }
});

module.exports = router;
