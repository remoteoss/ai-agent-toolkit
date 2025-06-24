import { RemoteApiClient } from './api.client';

// Mock fetch to avoid making actual HTTP requests
global.fetch = jest.fn();

describe('RemoteApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw an error if no API key is provided', () => {
      expect(() => new RemoteApiClient('')).toThrow(
        'API key is required for RemoteApiClient',
      );
      expect(() => new RemoteApiClient(null as any)).toThrow(
        'API key is required for RemoteApiClient',
      );
      expect(() => new RemoteApiClient(undefined as any)).toThrow(
        'API key is required for RemoteApiClient',
      );
    });

    it('should use provided baseUrl when specified', () => {
      const customBaseUrl = 'https://custom.api.com/v1';
      const client = new RemoteApiClient('test_key', customBaseUrl);

      // Access the private baseUrl property for testing
      expect((client as any).baseUrl).toBe(customBaseUrl);
    });

    it('should auto-detect sandbox URL for test API keys', () => {
      const testApiKey = 'ra_test_12345abcdef';
      const client = new RemoteApiClient(testApiKey);

      expect((client as any).baseUrl).toBe(
        'https://gateway.remote-sandbox.com/v1',
      );
    });

    it('should auto-detect production URL for production API keys', () => {
      const prodApiKey = 'ra_prod_12345abcdef';
      const client = new RemoteApiClient(prodApiKey);

      expect((client as any).baseUrl).toBe('https://gateway.remote.com/v1');
    });

    it('should auto-detect production URL for non-test API keys', () => {
      const otherApiKey = 'ra_other_12345abcdef';
      const client = new RemoteApiClient(otherApiKey);

      expect((client as any).baseUrl).toBe('https://gateway.remote.com/v1');
    });

    it('should handle edge cases for API key prefixes', () => {
      // Test API key that starts with 'ra_test' but not 'ra_test_'
      const edgeCaseKey = 'ra_testother_12345';
      const client = new RemoteApiClient(edgeCaseKey);

      expect((client as any).baseUrl).toBe('https://gateway.remote.com/v1');
    });
  });

  describe('determineBaseUrlFromApiKey', () => {
    it('should return sandbox URL for test API keys', () => {
      const client = new RemoteApiClient('dummy_key');
      const method = (client as any).determineBaseUrlFromApiKey.bind(client);

      expect(method('ra_test_12345')).toBe(
        'https://gateway.remote-sandbox.com/v1',
      );
      expect(method('ra_test_abcdef')).toBe(
        'https://gateway.remote-sandbox.com/v1',
      );
      expect(method('ra_test_xyz123')).toBe(
        'https://gateway.remote-sandbox.com/v1',
      );
    });

    it('should return production URL for non-test API keys', () => {
      const client = new RemoteApiClient('dummy_key');
      const method = (client as any).determineBaseUrlFromApiKey.bind(client);

      expect(method('ra_prod_12345')).toBe('https://gateway.remote.com/v1');
      expect(method('ra_live_12345')).toBe('https://gateway.remote.com/v1');
      expect(method('ra_12345')).toBe('https://gateway.remote.com/v1');
      expect(method('some_other_key')).toBe('https://gateway.remote.com/v1');
    });

    it('should handle edge cases correctly', () => {
      const client = new RemoteApiClient('dummy_key');
      const method = (client as any).determineBaseUrlFromApiKey.bind(client);

      // Keys that contain 'ra_test' but don't start with 'ra_test_'
      expect(method('ra_testother')).toBe('https://gateway.remote.com/v1');
      expect(method('ra_test')).toBe('https://gateway.remote.com/v1'); // Missing underscore
      expect(method('prefix_ra_test_suffix')).toBe(
        'https://gateway.remote.com/v1',
      );
    });
  });

  describe('API key and base URL integration', () => {
    it('should store the correct API key', () => {
      const apiKey = 'ra_test_12345';
      const client = new RemoteApiClient(apiKey);

      expect((client as any).apiKey).toBe(apiKey);
    });

    it('should prefer explicit baseUrl over auto-detection', () => {
      const testApiKey = 'ra_test_12345';
      const customBaseUrl = 'https://custom.example.com/v1';
      const client = new RemoteApiClient(testApiKey, customBaseUrl);

      expect((client as any).baseUrl).toBe(customBaseUrl);
    });
  });
});
