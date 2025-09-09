import {
  pdftojpgConvertor,
  pdftopngConvertor,
  deletePics,
} from "../utils/converter_pdf_to_img.js";
import { ToolPaths, ToolSPmatNo } from "../src/DB/models.js";

class SchemeService {
  async createPNGfromPDF(path_to_pdf, tool_code) {
    await pdftopngConvertor(path_to_pdf, tool_code);
  }
  async createJPGfromPDF(path_to_pdf, tool_code) {
    await pdftojpgConvertor(path_to_pdf, tool_code);
  }
  async updateTool(data) {
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
      const checker = data.filter((el) => "id" in el);

      if (checker.length === 0) {
        const toolList = data.reduce((accumulator, currentValue) => {
          if (!accumulator.includes(currentValue.tool_code.toString())) {
            accumulator = [...accumulator, currentValue.tool_code.toString()];
          }
          return accumulator;
        }, []);
        const tool_promise = toolList.map(async (el) => {
          await ToolSPmatNo.destroy({ where: { tool_code: el.toString() } });
        });
        await Promise.all(tool_promise);
        const uniqueArray = data.filter((value, index) => {
          const _value = JSON.stringify(value);
          return (
            index ===
            data.findIndex((obj) => {
              return JSON.stringify(obj) === _value;
            })
          );
        });
        const promises = uniqueArray.map(async (e) => {
          const current = await ToolSPmatNo.findOne({
            where: {
              sppiccode: e.sppiccode.toString(),
              tool_code: e.tool_code.toString(),
            },
          });
          if (!current) {
            return await ToolSPmatNo.create({
              ...e,
              sppiccode: e.sppiccode.toString(),
            });
          }
          return await current.update(e);
        });
        await Promise.all(promises);
      } else {
        const promises = data.map(async (el) => {
          const current = await ToolSPmatNo.findOne({ where: { id: el.id } });
          if (!current) {
            return;
          }
          return await current.update({ ...current, ...el });
        });
        await Promise.all(promises);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getToolList(options) {
    try {
      const data = await ToolPaths.findAll({
        ...options,
        raw: true,
        order: [["tool_code", "ASC"]],
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  async getSPmatNoByToolCode({ options, tool_code }) {
    try {
      return await ToolSPmatNo.findAll({
        where: { tool_code },
        raw: true,
        order: [["sppiccode", "ASC"]],
        ...options,
      });
    } catch (error) {
      return error;
    }
  }

  async getToolCodesBySPmatNo({ options, spmatNo }) {
    return await ToolSPmatNo.findAll({
      where: { spmatNo },
      ...options,
    });
  }

  async deleteAllInfo(tool_code) {
    try {
      const currentTool = await ToolPaths.findOne({
        where: { tool_code: tool_code.toString() },
        raw: true,
      });
      if (currentTool) {
        console.log(currentTool);
        await ToolSPmatNo.destroy({
          where: { tool_code: tool_code.toString() },
        });
        await ToolPaths.destroy({ where: { tool_code: tool_code.toString() } });
        await deletePics(currentTool.tool_path, tool_code);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new SchemeService();
