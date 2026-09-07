import { fs } from "file-system"
import { ToolPaths, ToolSPmatNo, New_ToolSPmatNo, } from "../src/models.js"
import pdfScheme_service from "../src/services/pdfScheme_service.js"
import { S3_service } from "../src/services/s3.js"
import { pdf_to_pictures_save_S3 } from "../src/utils/converter_pdf_to_img.js"
import { pdfPath } from "../folders.js"

async function migrate() {
    const currentTools = await ToolPaths.findAll({ raw: true })
    const tools_promises = currentTools.map(async (tool) => {
        const { tool_code, tool_name, document_length, picture_number } = tool
        pdfScheme_service.add_new_tool({ tool_code, tool_name, document_length, picture_number, current_version: true, version: 1 })
        const file = fs.readFileSync(pdfPath + tool_name)
        await S3_service.upload(file, tool_name, `${tool_code}/${1}/`);
        await pdf_to_pictures_save_S3(file, document_length, tool_code, 1)
    })
    Promise.all(tools_promises)
    const Current_ToolSPmatNo = await ToolSPmatNo.findAll({ raw: true })
    const promises_SPMatno = Current_ToolSPmatNo.map(async (el) => {
        const { sppicode_num, tool_code, spmatNo, sppiccode, spqty, top, left, diametr } = el
        await New_ToolSPmatNo.create({ version: 1, tool_code, list_num: 1, spmatNo, sppiccode, sppicode_num, spqty, top, left, diametr })
    })
    Promise.all(promises_SPMatno)
}
try {
    await migrate()
} catch (e) {
    console.log(e)
}