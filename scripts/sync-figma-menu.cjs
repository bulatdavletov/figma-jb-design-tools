const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const pkgPath = path.join(root, 'package.json')
const registryPath = path.join(root, 'src', 'app', 'tools-registry-data.json')

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
const tools = JSON.parse(fs.readFileSync(registryPath, 'utf8'))

const QUICK_ACTIONS = [
  {
    name: 'Run Automation',
    main: 'src/run-automation/main.ts',
    ui: 'src/app/ui.tsx',
    parameterOnly: false,
    parameters: [
      {
        name: 'Automation',
        key: 'automation',
        description: 'Choose a saved automation',
        allowFreeform: false,
      },
    ],
  },
]

const menu = [
  {
    name: 'All Tools',
    main: 'src/home/main.ts',
    ui: 'src/app/ui.tsx',
  },
  ...tools.map((tool) => ({
    name: tool.menuLabel,
    main: tool.main,
    ui: 'src/app/ui.tsx',
  })),
  ...QUICK_ACTIONS,
]

pkg['figma-plugin'] = pkg['figma-plugin'] || {}
pkg['figma-plugin'].menu = menu

fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8')
console.log(`Synced ${menu.length} menu entries from tools-registry-data.json`)
