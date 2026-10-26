import { PARTICIPANT_COLUMNS, type ParticipantInput } from "./participants";

export const MAX_IMPORT_BYTES = 5 * 1024 * 1024;
export const MAX_IMPORT_ROWS = 1000;
const MAX_EXPANDED_BYTES = 20 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 256;
const ZIP_END_SIGNATURE = 0x06054b50;
const ZIP_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP_FILE_SIGNATURE = 0x04034b50;
const ZIP_END_SIZE = 22;
const ZIP_MAX_COMMENT = 65535;
const ZIP_DIRECTORY_SIZE = 46;
const ZIP_FILE_HEADER_SIZE = 30;
const DEFLATE_METHOD = 8;
const ENCRYPTED_FLAG = 1;
const ZIP64_SIZE = 0xffffffff;
const SHEET_NAME = "Participantes";

// Deliberately limited to the data-only XLSX template. No formulas, macros or uploads.
async function openWorkbook(buffer: ArrayBuffer) {
  const view = new DataView(buffer), bytes = new Uint8Array(buffer);
  let end = bytes.length - ZIP_END_SIZE;
  const minimum = Math.max(0, end - ZIP_MAX_COMMENT);
  while (end >= minimum && view.getUint32(end, true) !== ZIP_END_SIGNATURE) end--;
  if (end < minimum || end < 0) throw new Error("El archivo no es un libro XLSX válido.");
  if (view.getUint16(end + 4, true) || view.getUint16(end + 6, true)) throw new Error("No se admiten archivos divididos.");
  const count = view.getUint16(end + 10, true);
  let offset = view.getUint32(end + 16, true), expanded = 0;
  if (count > MAX_ZIP_ENTRIES) throw new Error("El libro tiene demasiados componentes. Usa la plantilla.");
  const entries = new Map<string, { offset: number; compressed: number; size: number; method: number }>();
  for (let index = 0; index < count; index++) {
    if (offset + ZIP_DIRECTORY_SIZE > end || view.getUint32(offset, true) !== ZIP_DIRECTORY_SIGNATURE) throw new Error("El libro está incompleto o dañado.");
    const flags = view.getUint16(offset + 8, true), method = view.getUint16(offset + 10, true);
    const compressed = view.getUint32(offset + 20, true), size = view.getUint32(offset + 24, true);
    const nameSize = view.getUint16(offset + 28, true), extraSize = view.getUint16(offset + 30, true), commentSize = view.getUint16(offset + 32, true);
    const localOffset = view.getUint32(offset + 42, true);
    expanded += size;
    if (flags & ENCRYPTED_FLAG || compressed === ZIP64_SIZE || size === ZIP64_SIZE || expanded > MAX_EXPANDED_BYTES) throw new Error("Libro protegido o demasiado grande. Usa una copia simple de la plantilla.");
    if (offset + ZIP_DIRECTORY_SIZE + nameSize + extraSize + commentSize > end) throw new Error("El directorio del libro está dañado.");
    const name = new TextDecoder().decode(bytes.subarray(offset + ZIP_DIRECTORY_SIZE, offset + ZIP_DIRECTORY_SIZE + nameSize));
    if (entries.has(name)) throw new Error("El libro contiene componentes repetidos.");
    entries.set(name, { offset: localOffset, compressed, size, method });
    offset += ZIP_DIRECTORY_SIZE + nameSize + extraSize + commentSize;
  }
  if (entries.has("xl/vbaProject.bin")) throw new Error("Usa un libro XLSX sin macros.");
  return async (path: string, optional = false): Promise<Document | null> => {
    const entry = entries.get(path);
    if (!entry) {
      if (optional) return null;
      throw new Error("Falta una parte del libro. Descarga y usa la plantilla.");
    }
    if (entry.offset + ZIP_FILE_HEADER_SIZE > bytes.length || view.getUint32(entry.offset, true) !== ZIP_FILE_SIGNATURE) throw new Error("El libro está dañado.");
    const start = entry.offset + ZIP_FILE_HEADER_SIZE + view.getUint16(entry.offset + 26, true) + view.getUint16(entry.offset + 28, true);
    if (start + entry.compressed > bytes.length) throw new Error("El libro está incompleto.");
    let content: Uint8Array = bytes.slice(start, start + entry.compressed);
    if (entry.method === DEFLATE_METHOD) {
      const stream = new Blob([content as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      const reader = stream.getReader(), chunks: Uint8Array[] = [];
      let length = 0;
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          length += value.length;
          if (length > entry.size || length > MAX_EXPANDED_BYTES) throw new Error("El contenido expandido supera el tamaño permitido.");
          chunks.push(value);
        }
      } finally { await reader.cancel(); }
      content = new Uint8Array(length);
      let position = 0;
      for (const chunk of chunks) { content.set(chunk, position); position += chunk.length; }
    } else if (entry.method !== 0) throw new Error("Compresión no compatible. Guarda el archivo como XLSX desde Excel.");
    if (content.length !== entry.size) throw new Error("El contenido del libro está incompleto.");
    const xml = new DOMParser().parseFromString(new TextDecoder().decode(content), "application/xml");
    if (xml.getElementsByTagName("parsererror").length || xml.doctype) throw new Error("El libro contiene XML no compatible.");
    return xml;
  };
}

function elements(parent: Document | Element, name: string) {
  return Array.from(parent.getElementsByTagNameNS("*", name));
}

export async function readParticipantWorkbook(file: File): Promise<{ input: ParticipantInput; row: number }[]> {
  if (!file.name.toLowerCase().endsWith(".xlsx")) throw new Error("Selecciona un archivo .xlsx. Los archivos .xls y .xlsm no son compatibles.");
  if (!file.size || file.size > MAX_IMPORT_BYTES) throw new Error("Selecciona un archivo XLSX de hasta 5 MB.");
  if (typeof DecompressionStream === "undefined") throw new Error("Este navegador no permite leer XLSX. Usa una versión actual de Chrome o Edge.");
  const read = await openWorkbook(await file.arrayBuffer());
  const workbook = (await read("xl/workbook.xml"))!;
  const sheet = elements(workbook, "sheet").find((item) => item.getAttribute("name") === SHEET_NAME);
  if (!sheet) throw new Error("El libro debe tener una hoja llamada Participantes. Usa la plantilla.");
  const relations = (await read("xl/_rels/workbook.xml.rels"))!;
  const relation = elements(relations, "Relationship").find((item) => item.getAttribute("Id") === sheet.getAttribute("r:id"));
  const target = relation?.getAttribute("Target");
  if (!target || relation?.getAttribute("TargetMode") === "External") throw new Error("La hoja no está disponible dentro del libro.");
  const sheetPath = new URL(target, "https://workbook.invalid/xl/workbook.xml");
  if (sheetPath.origin !== "https://workbook.invalid") throw new Error("La hoja debe pertenecer al libro.");
  const data = (await read(sheetPath.pathname.slice(1)))!;
  const shared = await read("xl/sharedStrings.xml", true);
  const strings = shared ? elements(shared, "si").map((item) => elements(item, "t").map((text) => text.textContent ?? "").join("")) : [];
  const rows = elements(data, "row");
  const result: { input: ParticipantInput; row: number }[] = [];
  let headerFound = false;
  for (const row of rows) {
    const values = Array<string>(PARTICIPANT_COLUMNS.length).fill("");
    for (const cell of elements(row, "c")) {
      if (elements(cell, "f").length) throw new Error("La plantilla admite solo valores, sin fórmulas. Pega los resultados como valores.");
      const type = cell.getAttribute("t"), raw = elements(cell, "v")[0]?.textContent ?? "";
      const value = type === "s" ? strings[Number(raw)] : type === "inlineStr" ? elements(cell, "t").map((text) => text.textContent ?? "").join("") : raw;
      if (value === undefined || type === "e") throw new Error("Hay una celda con error. Corrige el libro antes de importarlo.");
      const letters = cell.getAttribute("r")?.match(/^([A-Z]+)\d+$/)?.[1];
      if (!letters) throw new Error("Una celda no tiene una referencia válida.");
      const column = [...letters].reduce((index, letter) => index * 26 + letter.charCodeAt(0) - 64, 0) - 1;
      if (column >= values.length && value.trim()) throw new Error("El archivo tiene columnas adicionales. Usa las ocho columnas de la plantilla.");
      if (column < values.length) values[column] = value.trim();
    }
    if (!values.some(Boolean)) continue;
    if (!headerFound) {
      if (!PARTICIPANT_COLUMNS.every((name, index) => values[index] === name)) throw new Error("Los encabezados deben coincidir con la plantilla, en el mismo orden.");
      headerFound = true;
      continue;
    }
    if (result.length >= MAX_IMPORT_ROWS) throw new Error("Importa hasta 1000 participantes por archivo.");
    result.push({ input: Object.fromEntries(PARTICIPANT_COLUMNS.map((key, index) => [key, values[index]])) as ParticipantInput, row: Number(row.getAttribute("r")) });
  }
  if (!result.length) throw new Error("La hoja Participantes no tiene personas para importar.");
  return result;
}
