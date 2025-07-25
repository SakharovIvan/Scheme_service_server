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
  async updateTool(data){
        try {
        const current = await ToolPaths.findOne({
          where: { tool_code: data.tool_code.toString() },
        });
        if (!current) {
          return await ToolPaths.create(data);
        }
        return await current.update(data);
      
        } catch (error) {
      return error;
    }
  }
  async getPDFSchemePath(tool_code) {
    try {
      const data = await ToolPaths.findOne({ where: { tool_code }, raw: true });
      return data.tool_path;
    } catch (error) {
      return error;
    }
  }
  async spmatNoListUpd(data) {
    try {
      const promises = data.map(async (e) => {
        const current = await ToolSPmatNo.findOne({
          where: { spmatNo: e.spmatNo, tool_code: e.tool_code.toString() },
        });
        if (!current) {
          return await ToolSPmatNo.create(e);
        }
        return await current.update(e);
      });
      Promise.all(promises);
    } catch (error) {
      return error;
    }
  }
  async getToolList(options) {
    try {
      const data = await ToolPaths.findAll({ ...options, raw: true });
      return data;
    } catch (error) {
      return error;
    }
  }
  async getSPmatNoByToolCode({options,tool_code}) {
    return await ToolSPmatNo.findAll({ where: { tool_code } ,raw: true,...options});
  }

    async getToolCodesBySPmatNo({options,spmatNo}) {
    return await ToolSPmatNo.findAll({ where: { spmatNo },raw: true,...options });
  }
}

export default new SchemeService();
