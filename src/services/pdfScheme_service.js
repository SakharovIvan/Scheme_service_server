import {
  pdftojpgConvertor,
  pdftopngConvertor,
  deletePics,
  pdf_to_pictures_save_S3,
} from "../utils/converter_pdf_to_img.js";
import { Tool_Files, ToolPaths, ToolSPmatNo, New_ToolSPmatNo, Tools } from "../models.js";
import { pdf } from "pdf-to-img";

class SchemeService {

  async get_tools(data) {
    try {
      const tools_list = await Tools.findAll({ where: data, raw: true, order: [["tool_code", "ASC"]], })
      return tools_list
    } catch (er) { console.log(er) }
  }
  async get_current(tool_code) {
    try {
      const tools = await this.get_tools({ tool_code })
      const res = tools.filter((el) => el.version === tools.length)[0]
      return res
    } catch (err) {
      console.log(err)
    }

  }
  async add_new_tool(data) {
    try {
      await Tools.create(data)
      await this.set_new_version(data.tool_code, data.version)

      return this.get_tools(data)
    } catch (e) {
      console.log(e)
    }
  }
  async add_picture(tool_code, version, type, list_num = 1) {
    try {
      Tool_Files.create({ tool_code, version, list_num, type })
    } catch (e) {
      console.log(e)
    }
  }

  async create_pictures(file, document_length, tool_code, version) {
    console.log('create_pictures')
    try {
      console.log("create_pictures start")
      await pdf_to_pictures_save_S3(file, document_length, tool_code, version)
      return
    } catch (e) {
      console.log(e)
    }
  }

  async get_pdf_length(path_to_pdf) {
    try {
      return await pdf(path_to_pdf).then((data) => {
        if (data) {
          return data.length;
        }
        return 0;
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async set_new_version(tool_code, version) {
    const current_list = await this.getToolList({ tool_code })
    const promises = current_list.map(async (el) => {
      if (el.version === version) {
        await Tools.update({ current_version: true }, { where: { id: el.id } })
        return
      }
      await Tools.update({ current_version: false }, { where: { id: el.id } })
      return
    })
    Promise.all(promises)
  }
  async create_tool(data) {
    try {
      const current = await Tools.findAll({ where: data, raw: true })

    } catch (e) {
      console.log(e)
    }
  }

  async getToolList(options) {
    try {
      const data = await Tools.findAll({
        where: { ...options },
        raw: true,
        order: [["tool_code", "ASC"]],
      });
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async createPNGfromPDF(path_to_pdf, tool_code, num) {
    await pdftopngConvertor(path_to_pdf, tool_code, num);
    return
  }
  async createJPGfromPDF(path_to_pdf, tool_code, num) {
    await pdftojpgConvertor(path_to_pdf, tool_code, num);
    return
  }
  async updateTool(data) {
    try {
      const current = await Tools.findOne({
        where: { tool_code: data.tool_code, version: data.version },
      });
      if (!current) {
        return await Tools.create(data);
      }
      await current.update(data);
      return current.save(current)
    } catch (error) {
      console.log(error)
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
          await New_ToolSPmatNo.destroy({ where: { tool_code: el.toString() } });
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
        const promises = uniqueArray.map(async (e, index) => {
          const current = await New_ToolSPmatNo.findOne({
            where: {
              sppiccode: e.sppiccode.toString(),
              tool_code: e.tool_code.toString(),
            },
          });
          if (!current) {
            return await New_ToolSPmatNo.create({
              ...e,
              sppicode_num: index + 1,
              sppiccode: e.sppiccode.toString(),
            });
          }
          return await current.update(e);
        });
        await Promise.all(promises);
      } else {
        const promises = data.map(async (el) => {
          const current = await New_ToolSPmatNo.findOne({ where: { id: el.id } });
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

  async getSPmatNoByToolCode({ options, version, tool_code }) {
    try {
      return await New_ToolSPmatNo.findAll({
        where: { tool_code, version, ...options },
        raw: true,
        order: [["sppiccode", "ASC"]],

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

  async deleteAllInfo(tool_code, version) {
    try {
      const currentTool = await Tools.findOne({
        where: { tool_code: tool_code.toString(), version },
        raw: true,
      });
      if (currentTool) {
        console.log(currentTool);
        await Tools.destroy({
          where: { tool_code: tool_code.toString(), version },
        });
        await New_ToolSPmatNo.destroy({ where: { tool_code: tool_code.toString(), version } });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new SchemeService();
