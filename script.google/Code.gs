const RATING_VALUES = ['happy', 'neutral', 'sad'];
const SHEET_NAME = 'Ratings';

/**
 * Entry point for published Web App.
 */
function doGet(e) {
  const code = e && e.parameter && typeof e.parameter.code === 'string'
    ? e.parameter.code.trim()
    : '';

  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Califica la atención')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .append(`<script>window.INITIAL_CODE = ${JSON.stringify(code)};</script>`);
}

/**
 * Receives ratings from the front-end.
 * This function is called via google.script.run.
 */
function submitRating(payload) {
  if (!isValidPayload_(payload)) {
    return { success: false, error: 'Datos inválidos' };
  }

  const sheet = getOrCreateSheet_();
  sheet.appendRow([
    payload.createdAt,
    payload.customerCode || '',
    payload.rating,
  ]);

  return { success: true };
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    sheet.appendRow(['createdAt', 'customerCode', 'rating']);
  }

  return sheet;
}

function isValidPayload_(payload) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const ratingValid = typeof payload.rating === 'string' && RATING_VALUES.indexOf(payload.rating) > -1;
  const customerCodeValid = payload.customerCode === null || typeof payload.customerCode === 'string';

  const createdAtValid = typeof payload.createdAt === 'string' &&
    !isNaN(new Date(payload.createdAt).getTime()) &&
    payload.createdAt === new Date(payload.createdAt).toISOString();

  return ratingValid && customerCodeValid && createdAtValid;
}
