import { writeFileSync } from 'node:fs'
import ExcelJS from 'exceljs'

function streamObject(body) {
  return `<< /Length ${Buffer.byteLength(body)} >>\nstream\n${body}\nendstream`
}

function pageStream(lines) {
  const commands = ['BT', '/F1 16 Tf', '48 780 Td']
  lines.forEach((line, index) => {
    const safe = line.replace(/[()\\]/g, '')
    commands.push(index === 0 ? `(${safe}) Tj` : `0 -26 Td (${safe}) Tj`)
  })
  commands.push('ET')
  return commands.join('\n')
}

function buildPdf(pages) {
  const objects = []
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
  objects[2] = `<< /Type /Pages /Kids [${pages.map((_, index) => `${index + 4} 0 R`).join(' ')}] /Count ${pages.length} >>`
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  pages.forEach((lines, index) => {
    const contentId = 4 + pages.length + index
    objects[4 + index] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentId} 0 R /Resources << /Font << /F1 3 0 R >> >> >>`
    objects[contentId] = streamObject(pageStream(lines))
  })

  let output = '%PDF-1.4\n'
  const offsets = [0]
  for (let id = 1; id < objects.length; id += 1) {
    if (!objects[id]) continue
    offsets[id] = Buffer.byteLength(output)
    output += `${id} 0 obj\n${objects[id]}\nendobj\n`
  }
  const size = objects.length
  const startxref = Buffer.byteLength(output)
  output += `xref\n0 ${size}\n`
  output += '0000000000 65535 f \n'
  for (let id = 1; id < size; id += 1) {
    output += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
  }
  output += `trailer\n<< /Size ${size} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF`
  return output
}

const pdf = buildPdf([
  ['Baza znaniy VND', 'Obrazec vnutrennego normativnogo dokumenta', 'Stranitsa 1 iz 2'],
  ['Prilozhenie k obrazcu', 'Stranitsa 2 iz 2', 'Prosmotr, masshtab i polnyy ekran'],
])

writeFileSync(new URL('../public/samples/vnd-sample.pdf', import.meta.url), pdf)

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet('Prilozhenie')
sheet.addRow(['Razdel', 'Znachenie'])
sheet.addRow(['Obrazec', 'Prilozhenie k VND'])
await workbook.xlsx.writeFile(new URL('../public/samples/appendix.xlsx', import.meta.url))
