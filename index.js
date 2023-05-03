const express = require('express');
const xml2js = require('xml2js');
const ejs = require('ejs');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const PORT = 3000;

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  // Read the XML file
  fs.readFile('info_stocks.xml', 'utf-8', (err, xmlData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading XML file');
    }

    console.log('xmlData:', xmlData);

    // Parse the XML data into a JavaScript object
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error parsing XML data');
      }

      console.log('parsed XML data:', result);

      // Render the EJS template with the data
      res.render('index', { data: result.data });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});