const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')

const questions = require('./questions')

inquirer.prompt(questions.init).then(async ({ root, sourceFolders, assets }) => {
  try {
    const assetFiles = sourceFolders
      .split(',')
      .map((src) =>
        fs
          .readdirSync(path.join(__dirname, root, src, assets), {
            recursive: true,
            withFileTypes: true,
          })
          .filter(
            ({ name }) =>
              !name.includes('.html') &&
              !name.includes('.js') &&
              !name.includes('.ts') &&
              !name.includes('.jsx') &&
              !name.includes('.tsx') &&
              !name.includes('.css') &&
              !name.includes('.scss') &&
              !name.includes('.less') &&
              !name.includes('.ttf') &&
              !name.includes('.txt') &&
              !name.includes('.sass'),
          )
          .map((i) => ({
            name: i.name,
            path: i.parentPath,
            referenceCount: 0,
          })),
      )
      .flat()

    const codeFiles = sourceFolders
      .split(',')
      .map((src) =>
        fs
          .readdirSync(path.join(__dirname, root, src), { recursive: true, withFileTypes: true })
          .filter(
            ({ name }) =>
              name.includes('.html') ||
              name.includes('.js') ||
              name.includes('.ts') ||
              name.includes('.jsx') ||
              name.includes('.tsx') ||
              name.includes('.css') ||
              name.includes('.scss') ||
              name.includes('.less') ||
              name.includes('.sass'),
          )
          .map((f) => ({ name: f.name, path: f.parentPath })),
      )
      .flat()

    for (let file of codeFiles) {
      const code = fs.readFileSync(path.join(file.path, file.name))
      for (let asset of assetFiles) {
        if (code.includes(asset.name)) {
          asset.referenceCount++
        }
      }
    }

    const unusedAssets = assetFiles.filter(({ referenceCount }) => referenceCount === 0)

    console.log(`We found (${unusedAssets.length}) unused assets!`)

    if (unusedAssets.length === 0) exit(0)

    const { action } = await inquirer.prompt(questions.unused)

    for (let unusedFile of unusedAssets) {
      switch (action) {
        case 'List them':
          console.log(path.join(unusedFile.path, unusedFile.name))
          break
        case 'Delete them':
          fs.unlinkSync(path.join(unusedFile.path, unusedFile.name))
          console.log('Successfully deleted ' + unusedFile.name)
          break
      }
    }
  } catch (e) {
    throw e
  }
})
