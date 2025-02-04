import { ToolPaths } from "../src/DB/models.js";
import pdfScheme_service from "../services/pdfScheme_service.js";
import path from "path";

const __filename = process.cwd();
const __dirname = path.dirname(__filename);
const pdfPath = `${__dirname}/Scheme_service_server`;
async function createMasPictures(limit = 1, offset = 68) {
  const pdf_paths_from_DB = await ToolPaths.findAll({
    raw: true,
    limit,
    offset,
  });
console.log(pdf_paths_from_DB)
  const { tool_code, tool_path }=pdf_paths_from_DB[0]
  console.log(tool_code, tool_path)
   pdfScheme_service.createJPGfromPDF(pdfPath + tool_path, tool_code)
   .then(()=>pdfScheme_service.createPNGfromPDF(pdfPath + tool_path, tool_code))
     .then(()=>console.log(`${limit} ${offset} pictures created`))
  //const promises = pdf_paths_from_DB.map(
  //  async ({ tool_code, tool_path }) =>{
  //  await pdfScheme_service.createJPGfromPDF(pdfPath + tool_path, tool_code)
  //  await pdfScheme_service.createPNGfromPDF(pdfPath + tool_path, tool_code)
  //return }
  //);
  return
  // Promise.all(promises).then(() =>
  //  console.log(`${limit} ${offset} pictures created`)
  //);
}
try {
  let i=101
    setInterval(async()=> {await createMasPictures(1,i-1) 
      i++
      console.log(i)
    } ,10000)


} catch (err) {
  console.log(err);
}
