import { Router } from "express";
import fileUpload from "express-fileupload";
import path from "path";
import fs from "file-system";
import SchemeService from "../services/pdfScheme_service.js";

const __filename = process.cwd();
const __dirname = path.dirname(__filename);
const tempPath = `${__dirname}/Scheme_service_server/public/temp/`;
const imagesPath = `${__dirname}/Scheme_service_server/public/images/`;
const pdfPath = `${__dirname}/Scheme_service_server/public/pdf/`;

const toolSceme = new Router();
toolSceme.use(fileUpload());

toolSceme.post("/tool/upload/pdf/:id", (req, res) => {
  const toolcode = req.params.id;

  const { email } = req.body;

  if (!req.files) {
    return res.status(500).send({ msg: "File is not found" });
  }
  fs.mkdir(`${tempPath}${email}`, {
    recursive: true,
  });
  const myFile = req.files.files;
  myFile.mv(`${tempPath}${email}/${myFile.name}`, async function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occured" });
    }
    await SchemeService.createIMGfromPDF(
      `${tempPath}${email}/${myFile.name}`,
      toolcode
    );
    
    return res.send({ name: myFile.name, result: "Создано" });
  });
});

toolSceme.get("/tool/pdf/:id", (req, res) => {
  const toolcode = req.params.id;
  console.log(toolcode);
  SchemeService.getPDFSchemePath(toolcode).then((path) => {
    return res.sendFile(`${__dirname}/Scheme_service_server${path}`);
  });
});

toolSceme.get("/tool/image/:id", (req, res) => {
  const toolcode = req.params.id;
  return res.sendFile(`${imagesPath}${toolcode}.png`);
});
toolSceme.get("/tool/:id", (req, res) => {
  const toolcode = req.params.id;
  SchemeService.getSPmatNoByToolCode(toolcode).then((data) => {
    res.json({ tool: toolcode, data });
  });
});

export default toolSceme;
