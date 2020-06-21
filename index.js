const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const questions = require('./questions')

inquirer.prompt(questions.init).then(async ({ src, assets }) => {
  try {
    const assetFiles = fs
      .readdirSync(path.join(__dirname, src, assets))
      .map((i) => ({ name: i, referenceCount: 0 }))
    const codeFiles = fs
      .readdirSync(path.join(__dirname, src))
      .filter(
        (f) =>
          f.includes('.html') ||
          f.includes('.js') ||
          f.includes('.ts') ||
          f.includes('.jsx') ||
          f.includes('.tsx') ||
          f.includes('.css') ||
          f.includes('.scss') ||
          f.includes('.sass'),
      )

    for (let file of codeFiles) {
      const html = fs.readFileSync(path.join(__dirname, src, file))
      for (let asset of assetFiles) {
        if (html.includes(asset.name)) {
          asset.referenceCount++
        }
      }
    }

    const unusedAssets = assetFiles
      .filter(({ referenceCount }) => referenceCount === 0)
      .map((a) => a.name)

    console.log(`We found (${unusedAssets.length}) unused assets!`)

    if (unusedAssets.length === 0) exit(0)

    const { action } = await inquirer.prompt(questions.unused)

    for (let unusedFile of unusedAssets) {
      switch (action) {
        case 'List them':
          console.log(path.join(__dirname, src, assets, unusedFile))
          break
        case 'Delete them':
          await fs.unlinkSync(path.join(__dirname, src, assets, unusedFile))
          console.log('Successfully deleted ' + unusedFile)
          break
      }
    }
  } catch (e) {
    throw e
  }
})
