import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock requestAnimationFrame
global.requestAnimationFrame = (callback) => {
  setTimeout(callback, 0)
}

// Mock cancelAnimationFrame
global.cancelAnimationFrame = (id) => {
  clearTimeout(id)
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock Three.js WebGL context
const mockWebGLContext = {
  getExtension: jest.fn(),
  getParameter: jest.fn(),
  createShader: jest.fn(),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  createProgram: jest.fn(),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  useProgram: jest.fn(),
  createBuffer: jest.fn(),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  drawArrays: jest.fn(),
  clear: jest.fn(),
  clearColor: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  viewport: jest.fn(),
}

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue(mockWebGLContext)

// Mock fetch for API calls
global.fetch = jest.fn()

// Setup console error suppression for expected errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
