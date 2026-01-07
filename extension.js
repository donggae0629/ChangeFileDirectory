const vscode = require('vscode');
console.log('경로 변환 익스텐션이 활성화되었습니다!');
    
function activate(context) {
    let isAutoConvertEnabled = true;
	const toggleCommand = vscode.commands.registerCommand('myExtension.toggleAutoConvert', () => {
		isAutoConvertEnabled = !isAutoConvertEnabled;
		const status = isAutoConvertEnabled ? '활성화' : '비활성화';
		vscode.window.showInformationMessage('경로 자동 변환 기능이 '+ status+ ' 되었습니다');
	})

    // 문서 변경 감지 (자동 변환)
    
	const test = vscode.workspace.onDidChangeTextDocument(event => {
		if(!isAutoConvertEnabled){
			return;
		}
        event.contentChanges.forEach(async change => {
			const clipboard = await vscode.env.clipboard.readText();
			if(change.text === clipboard){
				if (change.text.includes('\\') && change.text.includes('C:')){
					const convertedText = change.text.replace(/\\/g, '/');
					const editor = vscode.window.activeTextEditor;
					
					if (editor) {
						editor.edit(editBuilder => {
							const targetRange = new vscode.Range(
								change.range.start,
								change.range.start.translate(0, change.text.length)
							);
							editBuilder.replace(targetRange, convertedText);
						})
							
					}
				}
			}
        })});


    context.subscriptions.push(toggleCommand, test);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}