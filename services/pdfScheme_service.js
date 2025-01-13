import {
  pdftojpgConvertor,
  pdftopngConvertor,
} from "../utils/converter_pdf_to_img.js";
import { ToolPaths, ToolSPmatNo } from "../src/DB/models.js";

class SchemeService {
  async createPNGfromPDF(path_to_pdf, tool_code) {
    await pdftopngConvertor(path_to_pdf, tool_code);
  }
  async createJPGfromPDF(path_to_pdf, tool_code) {
    await pdftojpgConvertor(path_to_pdf, tool_code);
  }
  async getPDFSchemePath(tool_code) {
    const data = await ToolPaths.findOne({ where: { tool_code }, raw: true });
    console.log(data)
    return data.tool_path;
  }
  async getSPmatNoByToolCode(tool_code) {
    return await ToolSPmatNo.findAll({ where: { tool_code } });
  } 
}

export default new SchemeService();
