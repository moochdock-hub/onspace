/**
 * Log levels for structured logging
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Log entry structure
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  enableConsole: boolean;
  minLevel: LogLevel;
  enableTimestamp: boolean;
}

const defaultConfig: LoggerConfig = {
  enableConsole: true,
  minLevel: LogLevel.INFO,
  enableTimestamp: true,
};

class Logger {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private shouldLog(level: LogLevel): boolean {
    const levelOrder: Record<LogLevel, number> = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3,
    };
    return levelOrder[level] >= levelOrder[this.config.minLevel];
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = this.config.enableTimestamp ? `[${entry.timestamp}] ` : '';
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    return `${timestamp}[${entry.level}] ${entry.message}${context}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    // Store log entry
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console output
    if (this.config.enableConsole) {
      const formattedMessage = this.formatMessage(entry);
      
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, error || '');
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, error || '');
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, error || '');
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, error || '');
          break;
      }
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Get recent log entries
   */
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
export const logger = new Logger();

// Export helper functions
export const logDebug = (message: string, context?: Record<string, unknown>) =>
  logger.debug(message, context);
export const logInfo = (message: string, context?: Record<string, unknown>) =>
  logger.info(message, context);
export const logWarn = (message: string, context?: Record<string, unknown>) =>
  logger.warn(message, context);
export const logError = (message: string, error?: Error, context?: Record<string, unknown>) =>
  logger.error(message, error, context);
