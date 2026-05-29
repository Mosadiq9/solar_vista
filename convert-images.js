const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const imagesDir = "d:/Desktop/3D/solar-website/images";
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith(".png") && !f.includes("og-preview"));

Promise.all(files.map(f => {
  const input = path.join(imagesDir, f);
  const output = path.join(imagesDir, f.replace(".png", ".webp"));
  return sharp(input).webp({ quality: 82 }).toFile(output).then(() => {
    const inSize = fs.statSync(input).size;
    const outSize = fs.statSync(output).size;
    console.log(`${f} -> webp | ${(inSize/1024).toFixed(0)}KB -> ${(outSize/1024).toFixed(0)}KB (-${(100-outSize/inSize*100).toFixed(0)}%)`);
  });
})).then(() => console.log("All done!")).catch(e => console.error(e.message));
