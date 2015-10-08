

import GoogleSpreadsheet from 'google-spreadsheet';

// spreadsheet key is the long id in the sheets URL
const my_sheet = new GoogleSpreadsheet('<spreadsheet key>');

// Without auth -- read only
// IMPORTANT: See note below on how to make a sheet public-readable!
// # is worksheet id - IDs start at 1
my_sheet.getRows( 1, (err, row_data) => {
    console.log(`pulled in ${row_data.length} rows`);
});

// With auth -- read + write
// see below for authentication instructions
//var creds = require('./google-generated-creds.json');
// OR, if you cannot save the file locally (like on heroku)
const creds = {
  client_email: 'yourserviceaccountemailhere@google.com',
  private_key: 'your long private key stuff here'
}

my_sheet.useServiceAccountAuth(creds, (err) => {
    if (err) {
        console.error('Error>>', err);
        return;
    }
    // getInfo returns info about the sheet and an array or "worksheet" objects
    my_sheet.getInfo( (err, sheet_info) => {
        console.log( `${sheet_info.title} is loaded`);
        // use worksheet object if you want to stop using the # in your calls

        const sheet1 = sheet_info.worksheets[0];
        sheet1.getRows( (err, rows) => {
            if (err) {
                console.error('Error>>', err);
                return;
            }
            rows[0].colname = 'new val';
            rows[0].save(); //async and takes a callback
            rows[0].del();  //async and takes a callback
        });
    });

    // column names are set by google and are based
  // on the header row (first row) of your sheet
    my_sheet.addRow( 2, { colname: 'col value'} );

    my_sheet.getRows( 2, {
        start: 100,          // start index
        num: 100,              // number of rows to pull
        orderby: 'name'  // column to order results by
    }, (err, row_data) => {
        if (err) {
            console.error('Error>>', err);
            return;
        }
        console.log('DATA>>>', row_data);
    });
})
