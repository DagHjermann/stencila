// this package will be moved into substance core
// then we need to use relative imports
import {
  AbstractEditor, BasePackage, TextNode,
  Document, Configurator, EditorSession,
  TextPropertyEditor
} from 'substance'

import '../BrowserDOMElementPatches'

const {UndoCommand, RedoCommand} = BasePackage

// TODO: maybe AbstractEditor is too heavy?
// still we need to do almost the same, so that nothing
// from the parent is leaking through to the children
export default
class TextInput extends AbstractEditor {

  constructor(parent, props = {}) {
    super(parent, _createEditorSession(props))
  }

  render($$) {
    let el = $$(this._getTagName()).addClass('sc-text-input')
    el.append(
      $$(TextInputEditor, {
        path: ['input', 'content']
      }).ref('input')
        .on('enter', this._onEnter)
        .on('escape', this._onEscape)
    )
    return el
  }

  didMount() {
    // set the cursor at the end of the content
    this.refs.input.selectLast()
  }

  // this component manages itself
  shouldRerender() {
    return false
  }

  getContent() {
    return this.getDocument().getContent()
  }

  _getDocument() {
    return this.context.editorSession.getDocument()
  }

  _getTagName() {
    return this.props.tagName || 'div'
  }

  _onEnter(event) {
    event.stopPropagation()
    this.el.emit('confirm')
  }

  _onEscape(event) {
    event.stopPropagation()
    this.el.emit('cancel')
  }

}

function _createEditorSession(props) {
  let config = new Configurator()
  config.addNode(TextNode)
  config.addToolGroup('annotations')
  config.addToolGroup('default')
  config.addCommand('undo', UndoCommand)
  config.addCommand('redo', RedoCommand)
  config.defineSchema({
    name: 'text-input',
    // FIXME: this does not make sense here
    // as we do not have a container model
    defaultTextType: 'text',
    // FIXME: the name 'ArticleClass' is not general enough
    // plus: the configurator does not fail when this is not specified
    ArticleClass: TextInputDocument,
  })
  if (props.package) {
    config.import(props.package)
  }
  let doc = config.createArticle()
  if (props.content) {
    doc.set(['input', 'content'], props.content)
  }
  let editorSession = new EditorSession(doc, {
    configurator: config
  })
  return {
    editorSession
  }
}

class TextInputDocument extends Document {
  constructor(...args) {
    super(...args)

    this.create({
      type: 'text',
      id: 'input',
      content: ''
    })
  }
  getContentNode() {
    return this.get('input')
  }
  getContent() {
    return this.getContentNode().getText()
  }
}

// TODO: would be good if there were some events triggered by
// Surfaces
class TextInputEditor extends TextPropertyEditor {

  onKeyDown(event) {
    let handled = false
    if (event.keyCode === 27) {
      handled = true
      this.el.emit('escape')
    }
    if (handled) {
      event.stopPropagation()
      event.preventDefault()
    } else {
      super.onKeyDown(event)
    }
  }

  selectLast() {
    const doc = this.getDocument()
    const input = doc.getContentNode()
    this.editorSession.setSelection({
      type: 'property',
      path: input.getTextPath(),
      startOffset: input.getLength(),
      surfaceId: this.id
    })
  }

  selectAll() {
    const doc = this.getDocument()
    const input = doc.getContentNode()
    this.editorSession.setSelection({
      type: 'property',
      path: input.getTextPath(),
      startOffset: 0,
      endffset: input.getLength(),
      surfaceId: this.id
    })
  }

  _handleEnterKey(...args) {
    super._handleEnterKey(...args)
    this.el.emit('enter')
  }
}
