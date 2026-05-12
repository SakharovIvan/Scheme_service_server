import { Router } from "express";
import fileUpload from "express-fileupload";
import { pdfPath, pngPath, jpgPath, __dirname, tempPath } from "../folders.js";
import SchemeService from "../services/pdfScheme_service.js";
import bodyParser from "body-parser";

const toolSceme = new Router();
toolSceme.use(fileUpload());

toolSceme.post("/tool/upload/pdf/:id/:name", (req, res) => {
  const toolcode = req.params.id;
  const filename = req.params.name;
  if (!req.files) {
    return res.status(404).send({ msg: "File is not found" });
  }

  const myFile = req.files.pdf;

  myFile.mv(`${pdfPath}/${filename}`, async function (err) {
    if (err) {
      console.log(err);
      return res.status(500).send({ msg: "Error occured" });
    }
    const doc_length = await SchemeService.get_pdf_length(`${pdfPath}/${filename}`)

    await SchemeService.updateTool({
      tool_code: toolcode,
      tool_path: "/public/toolPDF/" + filename,
      tool_name: filename,
      document_length: doc_length
    });
    await SchemeService.createPNGfromPDF(`${pdfPath}/${filename}`, toolcode);
    await SchemeService.createJPGfromPDF(`${pdfPath}/${filename}`, toolcode);

    return res.send({ name: filename, result: "Создано", code: 200, toolcode });
  });
});

toolSceme.delete("/tool", async (req, res) => {
  try {
    const { tool_code } = req.query;
    console.log(tool_code);
    await SchemeService.deleteAllInfo(tool_code);
  } catch (error) {
    console.log(error);
  }
});

toolSceme.post("/tool/update", bodyParser.json(), (req, res) => {
  const { body } = req;
  SchemeService.spmatNoListUpd(body.data).then((data) => res.json(data));
});

toolSceme.post("/tool/:id/:num", bodyParser.json(), async (req, res) => {
  try {

    const { id } = req.params;
    const { num } = req.params;
    const tool = await SchemeService.updateTool({ tool_code: id, picture_number: num });
    await SchemeService.createPNGfromPDF(`${__dirname}/Scheme_service_server${tool.dataValues.tool_path}`, tool.dataValues.tool_code, Number(num));
    await SchemeService.createJPGfromPDF(`${__dirname}/Scheme_service_server${tool.dataValues.tool_path}`, tool.dataValues.tool_code, Number(num));


    return res.json({ status: 200 })
  } catch (error) {
    return error;
  }
});

toolSceme.get("/tools", (req, res) => {
  try {
    const options = req.query;
    return SchemeService.getToolList(options).then((data) => res.json(data));
  } catch (error) {
    console.log(error);
    return error;
  }
});

toolSceme.get("/spareparts/:id", (req, res) => {
  try {
    const spmatNo = req.params.id;

    const options = req.query;
    SchemeService.getToolCodesBySPmatNo({ options, spmatNo }).then((data) =>
      res.json(data)
    );
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

toolSceme.get("/tool/png/:id/:num", (req, res) => {
  const toolcode = req.params.id;
  const { num } = req.params;
  return res.sendFile(`${pngPath}${num}_${toolcode}.png`);
});
toolSceme.get("/tool/jpg/:id/:num", (req, res) => {
  const toolcode = req.params.id;
  const { num } = req.params;

  return res.sendFile(`${jpgPath}${num}_${toolcode}.jpg`);
});
toolSceme.get("/tool/:id", (req, res) => {
  const tool_code = req.params.id;
  const options = req.query;

  SchemeService.getSPmatNoByToolCode({ tool_code, options }).then((data) => {
    res.json({ tool: tool_code, data });
  });
});

export default toolSceme;
