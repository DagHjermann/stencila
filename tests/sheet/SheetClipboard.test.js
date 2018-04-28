import test from 'tape'
import { DefaultDOMElement as DOM, flatten } from 'substance'
import SheetClipboard from '../../src/sheet/SheetClipboard'
import { queryCells, getRangeFromMatrix } from '../../src/shared/cellHelpers'
import StubEngine from '../util/StubEngine'
import setupSheetSession from '../util/setupSheetSession'
import { setSheetSelection, getSources } from '../util/sheetTestHelpers'

test('SheetClipboard: copy', (t) => {
  let fixture = simple()
  let { sheetSession, sheetClipboard } = _setup(simple())
  setSheetSelection(sheetSession, 'A1:C3')
  let fixtureCells = queryCells(fixture.cells, 'A1:C3')
  let evt = new ClipboardEvent()
  sheetClipboard.onCopy(evt)
  let data = evt.clipboardData.data
  let plainText = data['text/plain']
  let html = data['text/html']
  t.ok(plainText, 'there should be a plain text copy')
  t.equal(plainText, fixtureCells.map(row => row.join('\t')).join('\n'), '.. encoded as tab separated values')
  t.ok(html, 'there should be an html copy')
  let dom = DOM.parseHTML(html)
  t.equal(dom.findAll('tr').length, 3, '.. with 3 <tr>')
  t.equal(dom.findAll('td').length, 9, '.. with 9 <td>')
  t.deepEqual(
    dom.findAll('td').map(td => td.textContent),
    flatten(fixtureCells),
    '.. and correct cell content'
  )
  t.end()
})

test('SheetClipboard: cut', (t) => {
  let fixture = simple()
  let { sheetSession, sheetClipboard, sheet } = _setup(simple())
  setSheetSelection(sheetSession, 'A1:B2')
  // Note: these are just the data provided as fixture
  let fixtureCells = queryCells(fixture.cells, 'A1:B2')
  let evt = new ClipboardEvent()
  sheetClipboard.onCut(evt)
  let data = evt.clipboardData.data
  let plainText = data['text/plain']
  let html = data['text/html']
  t.ok(plainText, 'there should be a plain text copy')
  t.equal(plainText, fixtureCells.map(row => row.join('\t')).join('\n'), '.. encoded as tab separated values')
  t.ok(html, 'there should be an html copy')
  let dom = DOM.parseHTML(html)
  t.deepEqual(
    dom.findAll('td').map(td => td.textContent),
    flatten(fixtureCells),
    '.. with correct cell contents'
  )
  // Note: these are real cells
  let cells = getRangeFromMatrix(sheet.getCellMatrix(), 0, 0, 1, 1)
  t.deepEqual(getSources(cells), [['', ''], ['', '']], 'cells should be empty')
  t.end()
})


function simple() {
  return {
    id: 'sheet',
    path: 'sheet.xml',
    type: 'sheet',
    name: 'My Sheet',
    columns: [{ name: 'x' }, { name: 'y' }, { name: 'z' }],
    cells: [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9'],
      ['10', '11', '12']
    ]
  }
}

function _setup(sheetData) {
  let { sheetSession, sheet } = setupSheetSession(sheetData, new StubEngine())
  let sheetClipboard = new SheetClipboard(sheetSession)
  return { sheetSession, sheet, sheetClipboard }
}

class ClipboardEventData {
  constructor() {
    this.data = {}
  }

  getData(format) {
    return this.data[format]
  }

  setData(format, data) {
    this.data[format] = data
  }

  get types() {
    return Object.keys(this.data)
  }
}

class ClipboardEvent {
  constructor() {
    this.clipboardData = new ClipboardEventData()
  }
  preventDefault() {}
  stopPropagation() {}
}