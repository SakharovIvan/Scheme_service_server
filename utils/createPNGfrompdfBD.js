import { ToolPaths } from "../src/DB/models.js";
import pdfScheme_service from "../services/pdfScheme_service.js";
import path from "path";

try {
  const __filename = process.cwd();
  const __dirname = path.dirname(__filename);
  const pdfPath = `${__dirname}/Scheme_service_server`;

  const pdf_paths_from_DB = await ToolPaths.findAll({ raw: true });
  const promises = pdf_paths_from_DB.map(async ({ tool_code, tool_path }) => {
    await pdfScheme_service.createJPGfromPDF(pdfPath + tool_path, tool_code);
    await pdfScheme_service.createPNGfromPDF(pdfPath + tool_path, tool_code);
    return;
  });
  Promise.all(promises).then(() => console.log("PNG files created"));
} catch (err) {
  console.log(err);
}
