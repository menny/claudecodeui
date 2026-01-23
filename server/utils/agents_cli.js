
/**
 * Get the path to the Claude CLI executable.
 * Defaults to 'claude' if CLAUDE_CLI_PATH environment variable is not set.
 * 
 * @returns {string} The path to the Claude CLI executable
 */
export function getClaudeCliPath() {
  return process.env.CLAUDE_CLI_PATH || 'claude';
}

