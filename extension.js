// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const util = require('./util');
const outline = require('./outline');

const builtinTemplate = `*{fileName}* {lineNumber}:\n\`\`\`{lang}\n{text}\n\`\`\``;
const builtinPrefix = '> &squ; ';
const builtinDelimiter = ' &raquo; ';


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {


	let genRenderMap = (editor) => {
		let selText = editor.document.getText(editor.selection);
		const dataMap = {
			fileName: util.getRelFilenameOfActiveFile() || "Untitled",
			lineNumber: editor.selection.start.line + 1,
			lineNumberEnd: editor.selection.end.line + 1,
			colNumber: editor.selection.start.character + 1,
			colNumberEnd: editor.selection.end.character + 1,
			lang: editor.document.languageId,
			text: selText,
		};

		return dataMap;
	}

	let getOutlinePath = async (editor, options) => {
		const outlineItems = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', editor.document.uri);
        if (!outlineItems) return null;
        const outlinePath = outline.makeOutlineChainFromPos(outlineItems, editor.selection.active).map(({ name }) => name);
        if (outlinePath.length === 0) {
            void vscode.window.showInformationMessage('Outline path is empty');
            return null;
        }
		return options.prefix + outlinePath.join(options.delimiter);
	}

	let cmdCopy = vscode.commands.registerCommand('copy-code-as-markdown.CopySelectionAsMarkdown', async function () {
		
		const editor = vscode.window.activeTextEditor;
		if (!Boolean(editor)) {
			return;
		}

		const config = vscode.workspace.getConfiguration('copyCodeAsMarkdown')

		const renderMap = genRenderMap(editor);
		if (!renderMap) {
			return;
		}

		const prefix = config.get('outlinePrefix') || builtinPrefix;
		const delimiter = config.get('outlineDelimiter') || builtinDelimiter;

		const outlinePath = await getOutlinePath(editor, {prefix, delimiter});
		if (outlinePath) {
			renderMap.outlinePath = outlinePath;
		}

		let template = config.get('template') || config.get('defaultTemplate')
		if (!template) {
			template = builtinTemplate
		}
		let templates = config.get('templates')
		let usingTemplateName = config.get('usingTemplateName') || 'default'

		template = templates[usingTemplateName] || template

		const mdText = util.renderStrMap(template, renderMap, false)//`*${fileName}* ${lineNumber}:\n\`\`\`${lang}\n${text}\n\`\`\``
		vscode.env.clipboard.writeText(mdText)
		vscode.window.showInformationMessage("Markdown copied!")
	});

	let cmdSwitchUsingTemplate = vscode.commands.registerCommand('copy-code-as-markdown.SwitchUsingTemplate', function () {
		const config = vscode.workspace.getConfiguration('copyCodeAsMarkdown')
		let templates = config.get('templates')
		let selectedName = config.get('usingTemplateName') || 'default'
		let templateNames = Object.keys(templates)

		// Show a quick pick
		const quickPick = vscode.window.createQuickPick();
		quickPick.items = templateNames.map(name => ({ label: name, picked: name === selectedName }));

		quickPick.onDidChangeSelection(selection => {
			config.update('usingTemplateName', selection[0].label, true)
			quickPick.hide();
		});

		quickPick.onDidHide(() => quickPick.dispose());

		quickPick.show();
	});

	context.subscriptions.push(cmdCopy);
	context.subscriptions.push(cmdSwitchUsingTemplate);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
