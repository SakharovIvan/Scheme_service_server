import path from "path";

const __filename = process.cwd();
const __dirname = path.dirname(__filename);
const tempPath = `${__dirname}/public/temp/`;
const pngPath = `${__dirname}/public/png/`;
const jpgPath = `${__dirname}/public/jpg/`;
const pdfPath = `${__dirname}/public/toolPDF/`;
export { tempPath, pngPath, jpgPath, __dirname, pdfPath };
