export default {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 15000,
  
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js", 
    "!**/node_modules/**",
    "!**/tests/**",
  ],
  
  coverageDirectory: "coverage",
  
  coverageReporters: [
    "text",       
    "text-summary", 
    "html",        
    "lcov",        
  ],
  
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
  
  verbose: true,
};