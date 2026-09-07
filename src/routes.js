import { Router } from "express";
import { pdfPath, pngPath, jpgPath, __dirname, tempPath } from "../folders.js";
import SchemeService from "./services/pdfScheme_service.js";
import bodyParser from "body-parser";
import { S3_service } from "./services/s3.js";
import multer from 'multer';
import { pdf_to_pictures_save_S3, pdfBuffer_tojpgConvertor } from "./utils/converter_pdf_to_img.js";

const toolSceme = new Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // Ограничение размера файла (10 МБ)
});


toolSceme.post("/tool/upload/pdf/:id/:name", upload.any(), async (req, res) => {
  try {
    const tool_code = req.params.id;
    const filename = req.params.name;
    if (!req.files[0]) {
      return res.status(404).send({ msg: "File is not found" });
    }
    const file = req.files[0]
    const current_list = await SchemeService.get_tools({ tool_code })
    const document_length = await SchemeService.get_pdf_length(file.buffer)
    let tool
    let version
    if (current_list.length === 0) {
      tool = await SchemeService.add_new_tool({ tool_code, document_length, tool_name: filename, version: 1 })
      version = 1
    } else {
      version = current_list.length + 1
      tool = await SchemeService.add_new_tool({ tool_code, document_length, tool_name: filename, version: version })
    }
    await S3_service.upload(file, filename, `${tool_code}/${version}/`);
    await pdf_to_pictures_save_S3(file.buffer, document_length, tool_code, version)


    return res.json({ status: "200" })
  } catch (e) {
    console.log(e)
  }

});

toolSceme.delete("/tool", async (req, res) => {
  try {
    const { tool_code, version } = req.query;
    await SchemeService.deleteAllInfo(tool_code, Number(version))
  } catch (error) {
    console.log(error);
  }
});

toolSceme.post("/tool/update", bodyParser.json(), (req, res) => {
  const { body } = req;
  console.log(body)
  try {
    SchemeService.spmatNoListUpd(body.data).then((data) => res.json(data));

  } catch (er) {
    console.log((er))
  }
});

toolSceme.post("/tool/:id/:version/:num", bodyParser.json(), async (req, res) => {
  try {

    const { id, version, num } = req.params;
    console.log(id, version, num)
    await SchemeService.updateTool({ tool_code: id, picture_number: num, version });
    return res.json({ status: 200 })
  } catch (error) {
    return error;
  }
});

toolSceme.get("/tools", (req, res) => {
  try {
    const options = req.query;
    return SchemeService.get_tools({ ...options }).then((data) => res.json(data));
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

toolSceme.get("/tool/pdf/:tool_code/:version", async (req, res) => {
  const { tool_code, version } = req.params;
  const current_tool_list = await SchemeService.get_tools({ tool_code, version })
  if (!current_tool_list || current_tool_list.length > 1) {
    return
  }
  const current_tool = current_tool_list[0]
  console.log(current_tool)
  console.log(`${current_tool}.pdf`, `/${current_tool.tool_code}/${current_tool.version}/`)
  const url = await S3_service.getDownloadUrl(`${current_tool.tool_name}`, `/${current_tool.tool_code}/${current_tool.version}/`)
  return res.redirect(url);
});
toolSceme.get("/tool/download/pdf/:id.pdf", async (req, res) => {
  const toolcode = req.params.id;

  const url = await S3_service.getFileUrl(`/${toolcode}`)
  return res.redirect(url);

});

toolSceme.get("/tool/png/:tool_code/:version/:num", async (req, res) => {
  const { tool_code, version, num } = req.params;
  const current_tool_list = await SchemeService.get_tools({ tool_code, version })
  if (!current_tool_list || current_tool_list.length > 1) {
    return
  }
  const current_tool = current_tool_list[0]
  const url = await S3_service.getDownloadUrl(`${current_tool.document_length - current_tool.picture_number + Number(num) - 1}.png`, `/${current_tool.tool_code}/${current_tool.version}/jpg/`)

  return res.redirect(url);
});
toolSceme.get("/tool/jpg/:tool_code/:version/:num", async (req, res) => {
  const { tool_code, version, num } = req.params;
  const current_tool_list = await SchemeService.get_tools({ tool_code, version })
  if (!current_tool_list || current_tool_list.length > 1) {
    return
  }
  const current_tool = current_tool_list[0]
  console.log(`tool/jpg download ${current_tool.document_length - current_tool.picture_number + Number(num)}.jpg`, `/${current_tool.tool_code}/${current_tool.version}/jpg/`)

  const url = await S3_service.getDownloadUrl(`${current_tool.document_length - current_tool.picture_number + Number(num)}.jpg`, `/${current_tool.tool_code}/${current_tool.version}/jpg/`)
  return res.redirect(url);
});

toolSceme.get("/tool/:tool_code/:version", (req, res) => {
  const { tool_code, version } = req.params;
  const options = req.query;
  console.log(tool_code, version, options)
  SchemeService.getSPmatNoByToolCode({ tool_code, version: Number(version), options }).then((data) => {
    res.json({ tool: tool_code, data });
  });
});

export default toolSceme;
