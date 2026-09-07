import { fs } from "file-system"
import { ToolPaths, ToolSPmatNo, New_ToolSPmatNo, } from "../src/models.js"
import pdfScheme_service from "../src/services/pdfScheme_service.js"
import { S3_service } from "../src/services/s3.js"
import { pdf_to_pictures_save_S3 } from "../src/utils/converter_pdf_to_img.js"
import { pdfPath } from "../folders.js"
const BATCH_SIZE = 10
async function migrate() {
    // Миграция ToolPaths 
    const currentTools = await ToolPaths.findAll({ raw: true })
    for (let i = 0; i < currentTools.length; i += BATCH_SIZE) {
        const batch = currentTools.slice(i, i + BATCH_SIZE)
        console.log(`Migrating tools: ${i + 1}-${Math.min(i + BATCH_SIZE, currentTools.length)} / ${currentTools.length}`)
        await Promise.all(batch.map(async (tool) => {
            const { tool_code, tool_name, document_length, picture_number, } = tool
            await pdfScheme_service.add_new_tool({ tool_code, tool_name, document_length, picture_number, current_version: true, version: 1, })
            const file = fs.readFileSync(pdfPath + tool_name)
            await S3_service.upload(file, tool_name, `${tool_code}/${1}/`)
            await pdf_to_pictures_save_S3(file, document_length, tool_code, 1)
        }))
        console.log(`Tools batch ${Math.floor(i / BATCH_SIZE) + 1} completed`)
    }
    // Миграция ToolSPmatNo 
    const currentToolSPmatNo = await ToolSPmatNo.findAll({ raw: true })
    for (let i = 0; i < currentToolSPmatNo.length; i += BATCH_SIZE) {
        const batch = currentToolSPmatNo.slice(i, i + BATCH_SIZE)
        console.log(`Migrating SPMatNo: ${i + 1}-${Math.min(i + BATCH_SIZE, currentToolSPmatNo.length)} / ${currentToolSPmatNo.length}`)
        await Promise.all(batch.map(async (el) => {
            const { sppicode_num, tool_code, spmatNo, sppiccode, spqty, top, left, diametr, } = el
            await New_ToolSPmatNo.create({ version: 1, tool_code, list_num: 1, spmatNo, sppiccode, sppicode_num, spqty, top, left, diametr, })
        }))
        console.log(`SPMatNo batch ${Math.floor(i / BATCH_SIZE) + 1} completed`)
    }
} try {
    await migrate()
    console.log("Migration completed")
} catch (e) { console.error("Migration failed:", e) }
