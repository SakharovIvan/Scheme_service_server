import { pdf } from "pdf-to-img";
import fs from "file-system";
import { pngPath, jpgPath, __filename } from "../folders.js";

async function pdftopngConvertor(path_to_pdf, tool_code, num = 1) {
  const document = await pdf(path_to_pdf, { scale: 3 });
  console.log(path_to_pdf, tool_code, num,document.length 
    ,document.length - num + 1 )
  const page12buffer = await document.getPage(document.length - num + 1);
  console.log(`${pngPath}${num}_${tool_code}.png`)
  await fs.writeFile(`${pngPath}${num}_${tool_code}.png`, page12buffer);
  console.log('png converted')
  return
}

async function pdftojpgConvertor(path_to_pdf, tool_code, num = 1) {
    console.log(path_to_pdf,'3')

  const document = await pdf(path_to_pdf, { scale: 3 });
  const page12buffer = await document.getPage(document.length  - num + 1);
  console.log(document.length + num - 1,'4')

  await fs.writeFile(`${jpgPath}${num}_${tool_code}.jpg`, page12buffer);
  return
}

function deletePics(path_to_pdf, tool_code) {
  try {
    console.log(__filename + path_to_pdf);
    fs.unlink(__filename + path_to_pdf, (err) => {
      if (err) console.log(err);
      console.log(`${__filename + path_to_pdf}` + " path/file.txt was deleted");
    });
    fs.unlink(`${pngPath}${tool_code}.png`, (err) => {
      if (err) console.log(err);
      console.log(`${pngPath}${tool_code}.png` + " was deleted");
    });
    fs.unlink(`${jpgPath}${tool_code}.jpg`, (err) => {
      if (err) console.log(err);
      console.log(`${jpgPath}${tool_code}.jpg` + " was deleted");
    });
  } catch (err) {
    console.log(err);
  }

}
export { pdftojpgConvertor, pdftopngConvertor, deletePics };
