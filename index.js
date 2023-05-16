const express = require('express');
const xml2js = require('xml2js');
const PDFDocument = require('pdfkit');
const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');
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

app.get('/download-pdf', (req, res) => {
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
      ejs.renderFile('views/index.ejs', { data: result.data }, (err, renderedHtml) => {
        if (err) {
          console.error('Error rendering HTML:', err);
          return res.status(500).send('Error rendering HTML');
        }

        const options = {
          format: 'Letter',
          // Specify the path to the CSS file
          "base": `file://${path.resolve('public/style.css')}`
        };

        pdf.create(renderedHtml, options).toFile('output.pdf', (err, response) => {
          if (err) {
            console.error('Error generating PDF:', err);
            return res.status(500).send('Error generating PDF');
          }

          console.log('PDF created successfully:', response.filename);
          res.download(response.filename, 'output.pdf', (err) => {
            if (err) {
              console.error('Error downloading PDF:', err);
              return res.status(500).send('Error downloading PDF');
            }

            // Remove the generated PDF file after it has been downloaded
            fs.unlink(response.filename, (err) => {
              if (err) {
                console.error('Error deleting PDF file:', err);
              }
            });
          });
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
