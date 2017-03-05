import { Component } from 'substance'
import TextInput from '../../shared/substance/text-input/TextInput'

/*
  The CellEditor is different to a regular TextPropertyEditor
  in the regard that it doesn't update the document during editing,
  only at the end.
*/
export default
class CellEditor extends Component {

  render($$) {
    var el = $$('div')
    el.append(
      $$(TextInput, {
        content: this.props.content
      }).ref('editor')
        .on('confirm', this.onConfirm)
        .on('cancel', this.onCancel)
    )
    return el
  }

  getContent() {
    return this.refs.editor.getContent()
  }

  onConfirm() {
    this.send('commitCellChange', this.getContent(), 'enter')
  }

  onCancel() {
    this.send('discardCellChange')
  }
}
