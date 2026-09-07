import { pdf } from "pdf-to-img";
import fs from "file-system";
import { pngPath, jpgPath, __filename } from "../../folders.js";
import { S3_service } from "../services/s3.js";
import pdfScheme_service from "../services/pdfScheme_service.js";

function arraed_num(list_number) {
  const res = []
  for (let i = 1; i <= list_number; i++) {
    res.push(i)
  }

  return res

}

async function pdf_to_pictures_save_S3(file, document_length, tool_code, version) {
  try {
    const document = await pdf(file, { scale: 3 });
    //const current_files = await getFilesWithPartialName(pngPath, tool_code + '.png')
    const array = arraed_num(document_length)
    console.log('pdf_to_pictures_save_S3')
    const promises = array.map(async (index) => {
      try {
        console.log(index)
        const page12buffer = await document.getPage(index);
        await S3_service.upload(page12buffer, index + '.png', `${tool_code}/${version}/png/`)
        await pdfScheme_service.add_picture(tool_code, version, 'png', index)
        await S3_service.upload(page12buffer, index + '.jpg', `${tool_code}/${version}/jpg/`)
        await pdfScheme_service.add_picture(tool_code, version, 'jpg', index)

      } catch (e) {
        console.log(e)
      }
    })
    return Promise.all(promises).catch((e) => console.log(e))
  } catch (e) { console.log(e) }

}

async function pdftopngConvertor(path_to_pdf, tool_code, num = 1) {
  const document = await pdf(path_to_pdf, { scale: 3 });
  if (!document) {
    console.log('no document' + path_to_pdf)
    return
  }
  const current_files = await getFilesWithPartialName(pngPath, tool_code + '.png')
  const promises = current_files.map(async (file) => {
    await delete_pic(pngPath + file)
    return
  })
  await Promise.all(promises)
  const array = arraed_num(num)
  const bulk_create_promise = array.map(async (el_bulk) => {
    const page12buffer = await document.getPage(document.length - num + el_bulk);
    await fs.promises.writeFile(`${pngPath}${el_bulk}_${tool_code}.png`, page12buffer);
    return
  })
  await Promise.all(bulk_create_promise)
  return

}

async function getFilesWithPartialName(directoryPath, partialName) {
  try {
    const files = await fs.promises.readdir(directoryPath);
    const filteredFiles = files.filter(file => file.includes(partialName));
    return filteredFiles;
  } catch (err) {
    console.error('Error reading directory:', err);
    throw err;
  }
}
async function delete_pic(path_to_pic) {
  fs.unlink(path_to_pic, (err) => {
    if (err) console.log(err);
    console.log(path_to_pic + " was deleted");
  });
}

async function pdftojpgConvertor(path_to_pdf, tool_code, num = 1) {
  const document = await pdf(path_to_pdf, { scale: 3 });
  if (!document) {
    console.log('no document' + path_to_pdf)
    return
  }
  const current_files = await getFilesWithPartialName(jpgPath, tool_code + '.jpg')
  const promises = current_files.map(async (file) => {
    await delete_pic(jpgPath + file)
    return
  })
  await Promise.all(promises)
  const array = arraed_num(num)
  const bulk_create_promise = array.map(async (el_bulk) => {
    console.log(document.length - num + el_bulk - 1)

    const page12buffer = await document.getPage(document.length - num + el_bulk);
    await fs.promises.writeFile(`${jpgPath}${el_bulk}_${tool_code}.jpg`, page12buffer);
    return
  })
  await Promise.all(bulk_create_promise)
  return
}

async function pdfBuffer_tojpgConvertor(path_to_pdf, tool_code, num = 1) {
  const document = await pdf(path_to_pdf, { scale: 3 });
  if (!document) {
    console.log('no document' + path_to_pdf)
    return
  }
  const current_files = await getFilesWithPartialName(jpgPath, tool_code + '.jpg')
  const promises = current_files.map(async (file) => {
    await delete_pic(jpgPath + file)
    return
  })
  await Promise.all(promises)

  const array = arraed_num(num)
  const bulk_create_promise = array.map(async (el_bulk) => {
    const page12buffer = await document.getPage(document.length - num + el_bulk);
    await fs.promises.writeFile(`${jpgPath}${el_bulk}_${tool_code}.jpg`, page12buffer);
    return
  })
  await Promise.all(bulk_create_promise)
  return
}

function deletePics(path_to_pdf, tool_code) {
  try {
    console.log(__filename + path_to_pdf);
    fs.unlink(__filename + path_to_pdf, (err) => {
      if (err) console.log(err);
      console.log(`${__filename + path_to_pdf}` + " path/file.txt was deleted");
    });
    fs.unlink(`${pngPath}${tool_code}.png`, (err) => {
      if (err) console.log(err);
      console.log(`${pngPath}${tool_code}.png` + " was deleted");
    });
    fs.unlink(`${jpgPath}${tool_code}.jpg`, (err) => {
      if (err) console.log(err);
      console.log(`${jpgPath}${tool_code}.jpg` + " was deleted");
    });
  } catch (err) {
    console.log(err);
  }

}
export { pdftojpgConvertor, pdftopngConvertor, deletePics, pdfBuffer_tojpgConvertor, pdf_to_pictures_save_S3 };
