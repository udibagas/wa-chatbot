require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const WhatsApp = require("whatsapp");

const {
  WA_BASE_URL,
  CLOUD_API_VERSION,
  WA_PHONE_NUMBER_ID,
  CLOUD_API_ACCESS_TOKEN,
} = process.env;

const wa = new WhatsApp();

wa.uploadFile = async (imagePath, type = "image/jpeg") => {
  const data = new FormData();
  data.append("messaging_product", "whatsapp");
  data.append("file", fs.createReadStream(imagePath), {
    contentType: type,
  });

  data.append("type", type);

  const response = await axios({
    url: `https://${WA_BASE_URL}/${CLOUD_API_VERSION}/${WA_PHONE_NUMBER_ID}/media`,
    method: "post",
    headers: { Authorization: `Bearer ${CLOUD_API_ACCESS_TOKEN}` },
    data: data,
  });

  return response.data;
};

module.exports = wa;
