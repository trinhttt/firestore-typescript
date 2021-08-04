
module.exports = {
    // preset: 'ts-jest',
    testMatch: ['<rootDir>/**/tests/**/*.test.+(js|ts)'],// ignore other files that aren't named [something].test.ts
    transformignorePatterns: ["/node_modules/(?!deck\.gl)"],
}
