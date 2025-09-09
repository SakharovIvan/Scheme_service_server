import path from "path";
import fs from "file-system";

const __filename = process.cwd();
const __dirname = path.dirname(__filename);
const tempPath = `${__dirname}/Scheme_service_server/public/temp/`;
const pngPath = `${__dirname}/Scheme_service_server/public/png/`;
const jpgPath = `${__dirname}/Scheme_service_server/public/jpg/`;
const pdfPath = `${__dirname}/Scheme_service_server/public/toolPDF/`;
export { tempPath, pngPath, jpgPath, __dirname, pdfPath,__filename };
