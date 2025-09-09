import { pdf } from "pdf-to-img";
import fs from "file-system";
import { pngPath, jpgPath,__filename } from "../folders.js";

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

function deletePics(path_to_pdf, tool_code) {
  try {
      console.log(__filename+path_to_pdf)
  fs.unlink(__filename+path_to_pdf, (err) => {
    if (err) console.log(err);
    console.log(`${__filename+path_to_pdf}`+" path/file.txt was deleted");
  });
  fs.unlink(`${pngPath}${tool_code}.png`, (err) => {
    if (err) console.log(err);
    console.log(`${pngPath}${tool_code}.png`+" was deleted");
  });
  fs.unlink(`${jpgPath}${tool_code}.jpg`, (err) => {
    if (err) console.log(err);
    console.log(`${jpgPath}${tool_code}.jpg`+ " was deleted");
  });
  } catch (err) {
    console.log(err)
  }

}
export { pdftojpgConvertor, pdftopngConvertor, deletePics };
