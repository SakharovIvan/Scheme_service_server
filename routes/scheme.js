import { Router } from "express";
import fileUpload from "express-fileupload";
import { pdfPath, pngPath, jpgPath, __dirname, tempPath } from "../folders.js";
import SchemeService from "../services/pdfScheme_service.js";
import bodyParser from "body-parser";

const toolSceme = new Router();
toolSceme.use(fileUpload());

toolSceme.post("/tool/upload/pdf/:id/:name", (req, res) => {
  const toolcode = req.params.id;
  const filename = req.params.name
  if (!req.files) {
    return res.status(404).send({ msg: "File is not found" });
  }

  const myFile = req.files.pdf;

  myFile.mv(`${pdfPath}/${filename}`, async function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occured" });
    }
    await SchemeService.updateTool({tool_code:toolcode,tool_path:'/public/toolPDF/'+filename,tool_name:filename})
    await SchemeService.createPNGfromPDF(`${pdfPath}/${filename}`, toolcode);
    await SchemeService.createJPGfromPDF(`${pdfPath}/${filename}`, toolcode);

    return res.send({ name: filename, result: "Создано" , code:200,toolcode});
  });
});

toolSceme.post("/tool/update",bodyParser.json(),  (req, res) => {

  const { body } = req;
  SchemeService.spmatNoListUpd(body.data).then((data) => res.json(data));
});

toolSceme.get("/tools",  (req, res) => {
  try {
    const options = req.query;
    SchemeService.getToolList(options).then((data) => res.json(data));
  } catch (error) {
    return error;
  }
});

toolSceme.get("/spareparts/:id",  (req, res) => {
  try {
      const spmatNo = req.params.id;

    const options = req.query;
    SchemeService.getToolCodesBySPmatNo({options,spmatNo}).then((data) => res.json(data));
  } catch (error) {
    return error;
  }
});


toolSceme.get("/tool/pdf/:id", (req, res) => {
  const toolcode = req.params.id;
  console.log(toolcode);
  SchemeService.getPDFSchemePath(toolcode).then((path) => {
    return res.sendFile(`${__dirname}/Scheme_service_server${path}`);
  });
});
toolSceme.get("/tool/download/pdf/:id.pdf", (req, res) => {
  const toolcode = req.params.id;
  console.log(toolcode);
  SchemeService.getPDFSchemePath(toolcode).then((path) => {
    return res.download(`${__dirname}/Scheme_service_server${path}`);
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
  const tool_code = req.params.id;
      const options = req.query;

  SchemeService.getSPmatNoByToolCode({tool_code,options}).then((data) => {
    res.json({ tool: tool_code, data });
  });
});

export default toolSceme;
