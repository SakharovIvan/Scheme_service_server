import { pdf } from "pdf-to-img";
import fs from "file-system";
import path from "path";

const __filename = process.cwd();
const __dirname = path.dirname(__filename);
const imagesPath = `${__dirname}/Scheme_service_server/public/images/`;

async function pdftoimgConvertor(path_to_pdf, tool_code) {
  const document = await pdf(path_to_pdf, { scale: 3 });
  const page12buffer = await document.getPage(document.length);

  await fs.writeFile(`${imagesPath}${tool_code}.png`, page12buffer);
}

export default pdftoimgConvertor;
