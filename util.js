const vscode = require('vscode');
const path = require('path');

function renderStrMap(template, dataMap, caseSensitive = true) {
    const pattern = /{\s*(\w+?)\s*}/g; // {property}
    if (caseSensitive) {
        return template.replace(pattern, (_, token) => dataMap[token] || '');
    }
    let lowerCaseDataMap = {};
    for (let key in dataMap) {
        lowerCaseDataMap[key.toLowerCase()] = dataMap[key];
    }
    return template.replace(pattern, (_, token) => lowerCaseDataMap[token.toLowerCase()] || '');
}

const getRelFilenameOfActiveFile = () => {
    let workspaces = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
    let activeFile = vscode.window.activeTextEditor.document;
    let absoluteFilePath = activeFile.uri.fsPath

    if (!workspaces) return absoluteFilePath;
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