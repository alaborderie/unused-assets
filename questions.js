module.exports = {
  init: [
    {
      type: 'input',
      name: 'src',
      message: 'What is your source code folder?',
      default: 'src',
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
