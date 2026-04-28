/**
 * Custom error classes for social platform providers.
 * Provides structured error info: platform, status code, raw API response.
 */

export class ProviderError extends Error {
  platform: string;
  rawResponse?: Record<string, unknown>;

  constructor(message: string, options: { platform: string; rawResponse?: Record<string, unknown> }) {
    super(message);
    this.name = 'ProviderError';
    this.platform = options.platform;
    this.rawResponse = options.rawResponse;
  }
}

export class APIError extends ProviderError {
  statusCode?: number;

  constructor(
    message: string,
    options: { platform: string; statusCode?: number; rawResponse?: Record<string, unknown> },
  ) {
    super(message, options);
    this.name = 'APIError';
    this.statusCode = options.statusCode;
  }
}

export class OAuthError extends ProviderError {
  constructor(message: string, options: { platform: string; rawResponse?: Record<string, unknown> }) {
    super(message, options);
    this.name = 'OAuthError';
  }
}

export class PublishError extends ProviderError {
  constructor(message: string, options: { platform: string; rawResponse?: Record<string, unknown> }) {
    super(message, options);
    this.name = 'PublishError';
  }
}

export class RateLimitError extends ProviderError {
  retryAfter?: number;

  constructor(
    message: string,
    options: { platform: string; retryAfter?: number; rawResponse?: Record<string, unknown> },
  ) {
    super(message, options);
    this.name = 'RateLimitError';
    this.retryAfter = options.retryAfter;
  }
}
