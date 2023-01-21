const vscode = require('vscode');
const path = require('path');

function renderStrMap(template, dataMap) {
    const pattern = /{\s*(\w+?)\s*}/g; // {property}
    return template.replace(pattern, (_, token) => dataMap[token] || '');
}

const getRelFilenameOfActiveFile = () => {
    let workspaces = vscode.workspace.workspaceFolders;
    let activeFile = vscode.window.activeTextEditor.document;
    let absoluteFilePath = activeFile.uri.fsPath

    if(!workspaces) return absoluteFilePath;
    let relativeFilePath = absoluteFilePath;
    for (let workspace of workspaces) {
        if (absoluteFilePath.replace(workspace.uri.fsPath, '') !== absoluteFilePath) {
            relativeFilePath = absoluteFilePath.replace(workspace.uri.fsPath, '').substr(path.sep.length);
            break;
        }
    }
    return relativeFilePath
}

module.exports = { renderStrMap, getRelFilenameOfActiveFile }