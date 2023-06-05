const express = require('express');
const xml2js = require('xml2js');
const PDFDocument = require('pdfkit');
const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');
const FTPClient = require('ftp');
const cron = require('node-cron');
const xmlLocation = "\\\\vicaim02\\download\\stock_off\\info_stocks.xml";

require('dotenv').config();
const PORT = 3000;

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

//upload schedule
cron.schedule('30 10 * * 1', () => {
  // Perform the request to trigger the `/upload-pdf` route
  axios.get('http://localhost:3000/upload-pdf')
    .then(response => {
      console.log('PDF upload triggered successfully');
    })
    .catch(error => {
      console.error('Error triggering PDF upload:', error);
    });
});

app.get('/', (req, res) => {
  // Read the XML file
  fs.readFile(xmlLocation, 'utf-8', (err, xmlData) => {
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
  fs.readFile(xmlLocation, 'utf-8', (err, xmlData) => {
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
          base: `file:///${path.resolve('public/style.css').replace(/\\/g, '/').replace(' ', '%20')}`
        };

        console.log(options);

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

app.get('/upload-pdf', async (req, res) => {
  // Read the XML file
  fs.readFile(xmlLocation, 'utf-8', (err, xmlData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading XML file');
    }

    console.log('xmlData:', xmlData);

    // Parse the XML data into a JavaScript object
    xml2js.parseString(xmlData, async (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error parsing XML data');
      }

      console.log('parsed XML data:', result);

      // Render the EJS template with the data
      const renderedHtml = await ejs.renderFile('views/index.ejs', { data: result.data });

      try {
        // Generate the PDF and save it to a file
        const options = {
          format: 'Letter',
          base: `file://${path.resolve('public/style.css')}`,
          footer: {
            height: '20mm',
            contents: {
              default: `<div style="text-align: center; font-size: 10px;">Ultima actualização em ${new Date().toLocaleString()}</div>`
            }
          }
        };

        const response = await new Promise((resolve, reject) => {
          pdf.create(renderedHtml, options).toFile('output.pdf', (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        });

        console.log('PDF created successfully:', response.filename);

        // FTP upload configuration
        const ftpUser = process.env.FTP_USERNAME;
        const ftpPassword = process.env.FTP_PASSWORD;
        const ftpPort = process.env.FTP_PORT;
        const ftpServer = process.env.FTP_SERVER;
        const remoteFilePath = '/public_html/vicaimalibrary/files/files/files/output.pdf';

        // Create an FTP client instance
        const ftpClient = new FTPClient();

        ftpClient.on('ready', () => {
          // Upload the PDF file
          ftpClient.put('output.pdf', remoteFilePath, (err) => {
            if (err) {
              console.error('Error uploading PDF:', err);
              ftpClient.end(); // Close the FTP connection
              return res.status(500).send('Error uploading PDF');
            }

            console.log('PDF uploaded successfully');

            // Remove the generated PDF file after it has been uploaded
            fs.unlink('output.pdf', (err) => {
              if (err) {
                console.error('Error deleting PDF file:', err);
              }
            });

            ftpClient.end(); // Close the FTP connection
            res.send('PDF uploaded to FTP successfully');
          });
        });

        ftpClient.on('error', (err) => {
          console.error('Error connecting to FTP:', err);
          return res.status(500).send('Error connecting to FTP');
        });

        // Connect to the FTP server
        ftpClient.connect({ host: ftpServer, user: ftpUser, password: ftpPassword });
      } catch (err) {
        console.error('Error generating or uploading PDF:', err);
        return res.status(500).send('Error generating or uploading PDF');
      }
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});