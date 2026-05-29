const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('C:\\Users\\sadik\\.gemini\\antigravity-ide\\brain\\95b8b581-41a4-4e7e-8a0c-e63b97e67c93\\.system_generated\\logs\\transcript.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('NABCEP')) {
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            const args = JSON.parse(tc.function.arguments);
            if (args.ReplacementContent && args.ReplacementContent.includes('NABCEP')) {
              console.log('--- REPLACEMENT CONTENT ---');
              console.log(args.ReplacementContent);
            }
            if (args.ReplacementChunks) {
              args.ReplacementChunks.forEach(c => {
                if (c.ReplacementContent.includes('NABCEP')) {
                  console.log('--- CHUNK REPLACEMENT CONTENT ---');
                  console.log(c.ReplacementContent);
                }
              });
            }
          }
        }
      } catch (e) {}
    }
  }
}
extract();
