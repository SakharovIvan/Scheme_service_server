import { ToolPaths } from "../src/DB/models.js";
import pdfScheme_service from "../services/pdfScheme_service.js";
import path from "path";

try {
  const __filename = process.cwd();
  const __dirname = path.dirname(__filename);
  const pdfPath = `${__dirname}/Scheme_service_server`;
  async function createMasPictures(limit = 5, offset = 0) {
    const pdf_paths_from_DB = await ToolPaths.findAll({
      raw: true,
      limit,
      offset,
    });
    const promises = pdf_paths_from_DB.map(async ({ tool_code, tool_path }) => {
      await pdfScheme_service.createJPGfromPDF(pdfPath + tool_path, tool_code);
      await pdfScheme_service.createPNGfromPDF(pdfPath + tool_path, tool_code);
      return;
    });
    Promise.all(promises).then(() =>
      console.log(`${limit} ${offset} pictures created`)
    );
  }

  await createMasPictures(50, 0);
} catch (err) {
  console.log(err);
}
