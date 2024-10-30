module.exports = {
  init: [
    {
      type: 'input',
      name: 'root',
      message: 'What is your project root folder?',
      default: '.',
    },
    {
      type: 'input',
      name: 'sourceFolders',
      message:
        'Where should we look for source files? (if multiple, use "," as a separator without spaces)',
      default: ['src'],
    },
    {
      type: 'input',
      name: 'assets',
      message: 'What is your assets folder?',
      default: 'assets',
    },
  ],
  unused: [
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do with them?',
      choices: ['List them', 'Delete them'],
    },
  ],
}
