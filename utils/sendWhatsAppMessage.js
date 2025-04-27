const useWa = require("../services/wa.service");

async function sendWhatsAppMessage({
  message,
  caption,
  phoneNumber,
  type,
  templateName,
  components = [],
  file,
}) {
  const wa = useWa();
  let response;

  switch (type) {
    case "text":
      response = await wa.messages.text({ body: message }, phoneNumber);
      break;

    case "image":
      const { id } = await wa.uploadFile(file.path, file.mimetype);
      response = await wa.messages.image({ id, caption }, phoneNumber);
      break;

    case "document":
      const { id: documentId } = await wa.uploadFile(file.path, file.mimetype);
      response = await wa.messages.document(
        { id: documentId, caption, filename: file.originalname },
        phoneNumber
      );
      break;

    case "template":
      const payload = {
        name: templateName,
        language: { code: "id" },
        components,
      };

      response = await wa.messages.template(payload, phoneNumber);
      break;

    default:
      const error = new Error("Invalid message type");
      error.status = 400;
      throw error;
  }

  const body = await response.responseBodyToJSON();
  if (response.statusCode() !== 200) throw body;
  return body;
}

module.exports = sendWhatsAppMessage;
