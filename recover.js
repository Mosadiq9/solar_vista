const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('C:\\Users\\sadik\\.gemini\\antigravity-ide\\brain\\95b8b581-41a4-4e7e-8a0c-e63b97e67c93\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let bestContent = '';
  
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      // Look for tool calls that replaced index.html
      if (obj.tool_calls) {
        for (const tc of obj.tool_calls) {
          if (tc.function.name === 'write_to_file' || tc.function.name === 'replace_file_content' || tc.function.name === 'multi_replace_file_content') {
            const args = JSON.parse(tc.function.arguments);
            if (args.TargetFile && args.TargetFile.includes('index.html') && !args.TargetFile.includes('admin')) {
              // We can't perfectly reconstruct from multi_replace easily if it's partial, 
              // but write_to_file has CodeContent.
              if (args.CodeContent) {
                bestContent = args.CodeContent;
              }
            }
          }
        }
      }
    } catch (e) {}
  }
  
  if (bestContent) {
    fs.writeFileSync('index_recovered.html', bestContent);
    console.log('Recovered from write_to_file!');
  } else {
    console.log('No full CodeContent found.');
  }
}
extract();
