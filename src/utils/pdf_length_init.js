import { __filename } from "../folders.js";
import pdfScheme_service from "../services/pdfScheme_service.js";

async function pdfLengthInit() {
    try {
        const tool_list = await pdfScheme_service.getToolList();
        const promises = tool_list.map(async (tool) => {
            try {
                const doc_length = await pdfScheme_service.get_pdf_length(__filename + tool.tool_path);
                await pdfScheme_service.updateTool({
                    ...tool,
                    document_length: doc_length
                })
            } catch (error) {
                console.log(error)
            }
        })
        await Promise.all(promises)
    } catch (error) {
        console.log(error)
    }
}
try {
    await pdfLengthInit();
} catch (error) {
    console.log(error)
}