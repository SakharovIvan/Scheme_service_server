import { Router } from "express";
import fileUpload from "express-fileupload";
import { pdfPath, pngPath, jpgPath, __dirname } from "../folders.js";
import SchemeService from "../services/pdfScheme_service.js";

const toolSceme = new Router();
toolSceme.use(fileUpload());

toolSceme.post("/tool/upload/pdf/:id", (req, res) => {
  const toolcode = req.params.id;
  console.log(req.body, req.data);

  if (!req.files) {
    return res.status(500).send({ msg: "File is not found" });
  }

  const myFile = req.files.files;
  myFile.name = req.body.name;
  myFile.mv(`${pdfPath}/${myFile.name}`, async function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occured" });
    }
    await SchemeService.createPNGfromPDF(`${pdfPath}/${myFile.name}`, toolcode);
    await SchemeService.createJPGfromPDF(`${pdfPath}/${myFile.name}`, toolcode);

    return res.send({ name: myFile.name, result: "Создано" });
  });
});

toolSceme.get("tools", (req, res) => {
  try {
    const options = req.query;
    SchemeService.getToolList(options).then((data) => res.json(data));
  } catch (error) {
    return error;
  }
});

toolSceme.get("/tool/pdf/:id", (req, res) => {
  const toolcode = req.params.id;
  console.log(toolcode);
  SchemeService.getPDFSchemePath(toolcode).then((path) => {
    return res.sendFile(`${__dirname}${path}`);
  });
});
toolSceme.get("/tool/download/pdf/:id.pdf", (req, res) => {
  const toolcode = req.params.id;
  console.log(toolcode);
  SchemeService.getPDFSchemePath(toolcode).then((path) => {
    return res.download(`${__dirname}${path}`);
  });
});

toolSceme.get("/tool/png/:id", (req, res) => {
  const toolcode = req.params.id;
  return res.sendFile(`${pngPath}${toolcode}.png`);
});
toolSceme.get("/tool/jpg/:id", (req, res) => {
  const toolcode = req.params.id;
  return res.sendFile(`${jpgPath}${toolcode}.jpg`);
});
toolSceme.get("/tool/:id", (req, res) => {
  const toolcode = req.params.id;
  SchemeService.getSPmatNoByToolCode(toolcode).then((data) => {
    res.json({ tool: toolcode, data });
  });
});

export default toolSceme;
