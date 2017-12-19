import { Command } from 'substance'

export default class FunctionUsageCommand extends Command {

  getCommandState({ selection, editorSession, surface }) {
    // TODO: disable this command if there is no functionManager
    const doc = editorSession.getDocument()
    const functionManager = surface ? surface.context.functionManager : null
    // console.log('selection', selection)
    if (functionManager && selection.isPropertySelection()) {
      let nodeId = selection.getNodeId()
      let node = doc.get(nodeId)
      // TODO: how to generalized this? This should only
      // be active if the cursor is inside of a CodeEditor
      if (node.type === 'cell' || node.type === 'source-code') {
        let state = node.state || {}
        let cursorPos = selection.start.offset
        let match = this._findFunction(state.nodes, cursorPos)
        if (match) {
          return {
            disabled: false,
            functionName: match.name,
            paramIndex: match.paramIndex,
            position: match.position
          }
        }
      }
    }

    return {
      disabled: true
    }
  }

  _findFunction(nodes, cursorPos) {
    if (!nodes) return

    let candidate
    nodes.forEach((node) => {
      if (node.type === 'function' && node.start <= cursorPos && node.end >= cursorPos) {
        let offset = cursorPos - node.start
        if (!candidate || offset < candidate.offset ) {
          // Param index
          let paramIndex
          let position
          node.args.forEach((arg, index) => {
            if (arg.start <= cursorPos && arg.end >= cursorPos) {
              paramIndex = index
              position = arg
            }
          })
          candidate = {
            name: node.name,
            offset,
            paramIndex,
            position
          }
        }
      }
    })
    return candidate
  }

  execute(params) { } // eslint-disable-line
}
