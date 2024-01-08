/** 
 * (c) 2023 Ricardo Bastos All Rights Reserverd
 **/

const express = require('express');
const xml2js = require('xml2js');
//const PDFDocument = require('pdfkit');
const ejs = require('ejs');
const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');
const FTPClient = require('ftp');
const cron = require('node-cron');
const axios = require('axios');
//const xmlLocation = "\\\\vicaim02\\download\\stock_off\\info_stocks.xml";
//const xmlLocation = ".\\info_stocks_decordorshd.xml";
const decordorSHDXml = "\\\\vicaim02\\Download\\stock_off\\stockoff_decordorSHD.xml"
const decordor3DXml = "\\\\vicaim02\\Download\\stock_off\\stockoff_decordor3D.xml"
const decordorHDXml = "\\\\vicaim02\\Download\\stock_off\\stockoff_decordorHD.xml"
const decordorSDXml = "\\\\vicaim02\\Download\\stock_off\\stockoff_decordorSD.xml"
const naturdorXml = "\\\\vicaim02\\Download\\stock_off\\stockoff_naturdor.xml"
const embossedCollectionXml = "\\\\vicaim02\\Download\\stock_off\\stockoff_embossedcollection.xml"


require('dotenv').config();
const PORT = 3000;

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

//upload schedule
cron.schedule('15 9 * * 5', () => {
  // Perform the request to trigger the `/upload-pdf` route
  axios.get('http://localhost:3000/upload-pdf')
    .then(_response => {
      console.log('PDF upload triggered successfully');
    })
    .catch(error => {
      console.error('Error triggering PDF upload:', error);
    });
});

app.get('/', (req, res) => {
  const routes = [
    { name: 'DecordorSHD', path: '/decordorSHD' },
    { name: 'Decordor3D', path: '/decordor3D' },
    { name: 'DecordorHD', path: '/decordorHD' },
    { name: 'DecordorSD', path: '/decordorSD' },
    { name: 'Naturdor', path: '/naturdor' },
    { name: 'EmbossedCollection', path: '/embossedcollection' }
  ];

  res.render('index', { routes });
});

app.get('/decordorSHD', (req, res) => {
  // Read the XML file
  fs.readFile(decordorSHDXml, 'utf-8', (err, xmlData) => {
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
      res.render('decordorSHD', { data: result.data, routeName: 'DecordorSHD' });
    });
  });
});

app.get('/decordor3D', (req, res) => {
  // Read the DecordorSD XML file
  fs.readFile(decordor3DXml, 'utf-8', (err, xmlData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading Decordor3D XML file');
    }

    // Parse the XML data into a JavaScript object
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error parsing Decordor3D XML data');
      }

      // Render the DecordorSD EJS template with the data
      res.render('decordor3D', { data: result.data, routeName:'Decordor3D' });
    });
  });
});

app.get('/decordorHD', (req, res) => {
  // Read the DecordorSD XML file
  fs.readFile(decordorHDXml, 'utf-8', (err, xmlData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading DecordorHD XML file');
    }

    // Parse the XML data into a JavaScript object
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error parsing DecordorHD XML data');
      }

      // Render the DecordorSD EJS template with the data
      res.render('decordorHD', { data: result.data, routeName:'DecordorHD' });
    });
  });
});

app.get('/decordorSD', (req, res) => {
  // Read the DecordorSD XML file
  fs.readFile(decordorSDXml, 'utf-8', (err, xmlData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading DecordorSD XML file');
    }

    // Parse the XML data into a JavaScript object
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error parsing DecordorSD XML data');
      }

      // Render the DecordorSD EJS template with the data
      res.render('decordorSD', { data: result.data, routeName:'DecordorSD' });
    });
  });
});

app.get('/naturdor', (req, res) => {
  // Read the DecordorSD XML file
  fs.readFile(naturdorXml, 'utf-8', (err, xmlData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading naturdor XML file');
    }

    // Parse the XML data into a JavaScript object
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error parsing naturdor XML data');
      }

      // Render the DecordorSD EJS template with the data
      res.render('naturdor', { data: result.data, routeName:'Naturdor' });
    });
  });
});

app.get('/embossedcollection', (req, res) => {
  // Read the DecordorSD XML file
  fs.readFile(embossedCollectionXml, 'utf-8', (err, xmlData) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading embossedcollection XML file');
    }

    // Parse the XML data into a JavaScript object
    xml2js.parseString(xmlData, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error parsing embossedcollection XML data');
      }

      // Render the DecordorSD EJS template with the data
      res.render('embossedcollection', { data: result.data, routeName:'EmbossedCollection' });
    });
  });
});

/*app.get('/download-pdf', async (req, res) => {
  const views = [
    { name: 'decordor3D', xmlLocation: decordor3DXml },
    { name: 'decordorHD', xmlLocation: decordorHDXml },
    { name: 'decordorSD', xmlLocation: decordorSDXml },
    { name: 'decordorSHD', xmlLocation: decordorSHDXml },
    { name: 'embossedcollection', xmlLocation: embossedCollectionXml },
    { name: 'naturdor', xmlLocation: naturdorXml },
    // Add more views as needed
  ];

  try {
    for (let i = 0; i < views.length; i++) {
      const { name, xmlLocation } = views[i];

      // Check if the response is still writable
      if (res.writableEnded) {
        console.error('Response is no longer writable');
        break;
      }

      // Read the XML file
      const xmlData = await fs.promises.readFile(xmlLocation, 'utf-8');

      // Parse the XML data into a JavaScript object
      const result = await xml2js.parseStringPromise(xmlData);

      // Render the EJS template with the data
      const renderedHtml = await ejs.renderFile(`views/${name}.ejs`, { data: result.data });

      // Generate the PDF and save it to a file
      const options = {
        format: 'Letter',
        base: `file://${path.resolve('public/style.css')}`
      };

      //const pdfPath = path.resolve(`output_${name}.pdf`);
      const pdfPath = path.resolve('public', 'pdf', `output_${name}.pdf`);

      await new Promise((resolve, reject) => {
        pdf.create(renderedHtml, options).toFile(pdfPath, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
      });

      // Check if the response is still writable
      if (res.writableEnded) {
        console.error('Response is no longer writable');
        break;
      }
    }

    // Once all the PDFs are generated, send a response indicating success
    return res.status(200).send('PDFs generated successfully');
  } catch (err) {
    console.error('Error generating PDFs:', err);
    return res.status(500).send('Error generating PDFs');
  }
});
*/

app.get('/upload-pdf', async (req, res) => {
  const views = [
    { name: 'Decordor3D', xmlLocation: decordor3DXml },
    { name: 'DecordorHD', xmlLocation: decordorHDXml },
    { name: 'DecordorSD', xmlLocation: decordorSDXml },
    { name: 'DecordorSHD', xmlLocation: decordorSHDXml },
    { name: 'EmbossedCollection', xmlLocation: embossedCollectionXml },
    { name: 'Naturdor', xmlLocation: naturdorXml },
    // Add more views as needed
  ];

  try {
    // Flag to keep track of whether an error occurred
    let errorOccurred = false;

    for (let i = 0; i < views.length; i++) {
      const { name, xmlLocation } = views[i];

      // Read the XML file
      const xmlData = await fs.promises.readFile(xmlLocation, 'utf-8');

      // Check if the XML data is empty
      if (!xmlData) {
        console.error(`XML file is empty: ${xmlLocation}`);
        continue; // Skip this iteration and proceed to the next XML file
      }

      // Parse the XML data into a JavaScript object
      let result;
      try {
        result = await xml2js.parseStringPromise(xmlData);
      } catch (parseError) {
        console.error(`Error parsing XML data: ${xmlLocation}`, parseError);
        errorOccurred = true; // Set the error flag
        continue; // Skip this iteration and proceed to the next XML file
      }

      // Check if the parsed result is empty
      if (!result) {
        console.error(`Error parsing XML data: ${xmlLocation}`);
        errorOccurred = true; // Set the error flag
        continue; // Skip this iteration and proceed to the next XML file
      }

      // Render the EJS template with the data
      const renderedHtml = await ejs.renderFile(`views/${name}.ejs`, { data: result.data, routeName: name });

      // Generate the PDF and save it to a file
      const options = {
        format: 'Letter',
        base: `file://${path.resolve('public/style.css')}`,
        footer: {
          height: '20mm',
          contents: {
            default: `<div style="text-align: center; font-size: 10px;">Ultima atualização em ${new Date().toLocaleString()}</div>`
          }
        }
      };

      const pdfPath = path.resolve('public', 'pdf', `stockoff_${name}.pdf`);

      await new Promise((resolve, reject) => {
        pdf.create(renderedHtml, options).toFile(pdfPath, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
      });

      // FTP upload configuration
      const ftpUser = process.env.FTP_USERNAME;
      const ftpPassword = process.env.FTP_PASSWORD;
      const ftpPort = process.env.FTP_PORT;
      const ftpServer = process.env.FTP_SERVER;
      const remoteFilePath = `/public_html/vicaimalibrary/files/files/files/stockoff_${name}.pdf`;

      // Create an FTP client instance
      const ftpClient = new FTPClient();

      ftpClient.on('ready', () => {
        // Upload the PDF file
        ftpClient.put(pdfPath, remoteFilePath, (err) => {
          if (err) {
            console.error('Error uploading PDF:', err);
            ftpClient.end(); // Close the FTP connection
            errorOccurred = true; // Set the error flag
            return;
          }

          console.log(`PDF ${name} uploaded successfully`);

          // Remove the generated PDF file after it has been uploaded
          fs.unlink(pdfPath, (err) => {
            if (err) {
              console.error('Error deleting PDF file:', err);
            }
          });

          if (i === views.length - 1) {
            ftpClient.end(); // Close the FTP connection
          }
        });
      });

      ftpClient.on('error', (err) => {
        console.error('Error connecting to FTP:', err);
        errorOccurred = true; // Set the error flag

        if (i === views.length - 1) {
          ftpClient.end(); // Close the FTP connection
        }
      });

      // Connect to the FTP server
      ftpClient.connect({ host: ftpServer, user: ftpUser, password: ftpPassword });
    }

    // Check if an error occurred during the loop
    if (!errorOccurred) {
      // If no errors occurred, send a success response
      res.status(200).send('PDFs generated and uploaded successfully');
    } else {
      // If an error occurred, send an error response
      res.status(500).send('Error generating or uploading PDF');
    }
  } catch (err) {
    console.error('Error generating or uploading PDF:', err);
    // Send an error response if an unhandled error occurs
    res.status(500).send('Error generating or uploading PDF');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});