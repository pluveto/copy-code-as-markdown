const vscode = require('vscode');

const findCurrentOutlineItem = (items, pos) => {
    if (!items)
        return;
    let itemIndex = -1;
    for (const [i, item] of items.entries()) {
        if (item.children.length > 0) {
            const foundItem = findCurrentOutlineItem(item.children, pos);
            if (foundItem)
                return foundItem;
        }
        if (item.range.contains(pos))
            itemIndex = i;
    }
    if (itemIndex === -1)
        return;
    return items[itemIndex];
};

const findCurrentEditorOutlineItem = async () => {
    const { activeTextEditor } = vscode.window;
    if (!activeTextEditor)
        return;
    const outlineItems = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', activeTextEditor.document.uri);
    return findCurrentOutlineItem(outlineItems, activeTextEditor.selection.active);
};

const makeOutlineChainFromPos = (rootItems, pos) => {
    const chain = [];
    const findMe = (items) => {
        let itemIndex = -1;
        for (const [i, item] of items.entries()) {
            if (item.range.contains(pos)) {
                chain.push(item);
                itemIndex = i;
            }
            if (item.children.length > 0) {
                const foundItem = findMe(item.children);
                if (foundItem)
                    return foundItem;
            }
        }
        if (itemIndex === -1)
            return;
        return items[itemIndex];
    };
    findMe(rootItems);
    return chain;
};

module.exports = { findCurrentOutlineItem, findCurrentEditorOutlineItem, makeOutlineChainFromPos };