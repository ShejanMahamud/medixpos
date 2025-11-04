/**
 * Post-build obfuscation script for MedixPOS
 * This script obfuscates the compiled JavaScript to protect license logic
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const JavaScriptObfuscator = require('javascript-obfuscator')
const fs = require('fs')
const path = require('path')
/* eslint-enable @typescript-eslint/no-require-imports */

// Obfuscation options - balanced between security and performance
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  selfDefending: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['rc4'],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: 'function',
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
}

// Files to obfuscate (main process files)
const filesToObfuscate = [
  'out/main/index.js',
  'out/main/services/license.js',
  'out/main/ipc/handlers/license-handlers.js'
]

console.log('🔒 Starting code obfuscation...')

let obfuscatedCount = 0

filesToObfuscate.forEach((filePath) => {
  const fullPath = path.join(__dirname, '..', filePath)

  if (fs.existsSync(fullPath)) {
    console.log(`   Obfuscating: ${filePath}`)

    try {
      const code = fs.readFileSync(fullPath, 'utf8')
      const obfuscationResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions)

      fs.writeFileSync(fullPath, obfuscationResult.getObfuscatedCode())
      obfuscatedCount++
      console.log(`   ✓ ${filePath}`)
    } catch (error) {
      console.error(`   ✗ Error obfuscating ${filePath}:`, error.message)
    }
  } else {
    console.warn(`   ⚠ File not found: ${filePath}`)
  }
})

console.log(
  `\n✓ Obfuscation complete! ${obfuscatedCount}/${filesToObfuscate.length} files obfuscated.\n`
)
