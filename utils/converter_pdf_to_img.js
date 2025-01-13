import { pdf } from "pdf-to-img";
import fs from "file-system";
import { pngPath, jpgPath } from "../folders.js";

async function pdftopngConvertor(path_to_pdf, tool_code) {
  const document = await pdf(path_to_pdf, { scale: 3 });
  const page12buffer = await document.getPage(document.length);

  await fs.writeFile(`${pngPath}${tool_code}.png`, page12buffer);
}

async function pdftojpgConvertor(path_to_pdf, tool_code) {
  const document = await pdf(path_to_pdf, { scale: 3 });
  const page12buffer = await document.getPage(document.length);

  await fs.writeFile(`${jpgPath}${tool_code}.jpg`, page12buffer);
}

export { pdftojpgConvertor, pdftopngConvertor };
