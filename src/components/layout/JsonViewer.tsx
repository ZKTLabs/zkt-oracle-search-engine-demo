import JsonView from '@uiw/react-json-view'
import { vscodeTheme } from '@uiw/react-json-view/vscode'

export const JsonViewer = ({ data }: { data: Record<string, any> }) => {
  return (
    <div className="max-w-4xl mt-4 mx-auto">
      <JsonView style={vscodeTheme} className="p-5 rounded-lg" value={data} />
    </div>
  )
}
