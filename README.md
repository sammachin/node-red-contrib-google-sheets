# node-red-contrib-google-sheets

A basic node for reading and writing from/to google sheets.

## Auth

To setup auth this node uses a google service account:

Create a new service account from [This Page](https://console.cloud.google.com/iam-admin/serviceaccounts?_ga=2.184919274.-272657095.1578084478)

Download a JSON credentials object for the service account.

Give that account access to the sheets API.

Share your sheet with the email address of the service account eg `nodered@nodered-12345.iam.gserviceaccount.com`

## Sheets

The sheet ID can be found in the URL of your google sheet, for example in
`https://docs.google.com/spreadsheets/d/1UuVIH2O38XK0TfPMGHk0HG_ixGLtLk6WoBKh4YSrDm4/edit#gid=0`

The ID would be `1UuVIH2O38XK0TfPMGHk0HG_ixGLtLk6WoBKh4YSrDm4`

## Cells
Google sheets uses the following syntax to reference a tab and cells of the worksheet

The format is `Sheet1!A1:C3`

Where `Sheet1` is the Sheet name followed by a `!` then the grid of the first cell eg `A1` then a `:` and finally the grid of the last cell eg `C3`

A range of cells can be a Row at `A1:A5`, a Column `A1:E1` or even a block such as `A1:C3`

