import { pdf } from "pdf-to-img";
import fs from "file-system";
import { pngPath, jpgPath, __filename } from "../folders.js";

function arraed_num(list_number) {
  const res = []
  for (let i = 1; i <= list_number; i++) {
    res.push(i)
  }

  return res

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
    console.log(document.length - num + el_bulk - 1)

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
export { pdftojpgConvertor, pdftopngConvertor, deletePics };
