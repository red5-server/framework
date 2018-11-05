import * as path from 'path'
import { JSDOM } from 'jsdom'
import { parseFile } from './files';

export interface Template {
  dom: JSDOM
  document: Document
  body: HTMLBodyElement
  file: string
  child?: Template
}

export async function extend(tpl: Template) {
  let document = tpl.document
  let item = document.querySelector(':scope > extends')
  if (!item) return tpl
  let inclFileName = item.getAttribute('file')
  if (inclFileName && item.parentElement) {
    let dir = path.dirname(tpl.file)
    let file = path.resolve(dir, inclFileName + (!inclFileName.endsWith('.rtpl') ? '.rtpl' : ''))
    let parent = await parseFile(file)
    // let rootTpl:Template
    if (parent) {
      parent.child = tpl
      // rootTpl = parent
      let ext = parent.document.querySelector('extends')
      if (ext && ext.parentElement) {
        ext.replaceWith(tpl.document)
        extend(parent)
      }
      return parent
    }
  }
  // rootTpl = tpl
  return tpl
}