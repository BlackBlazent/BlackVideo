/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import { PlatformModules } from '../import.modules';
import { HybridConfig } from '../hybrid.config';
import { LinkProcessor } from '../links.processors';

/**
 * CLI Connector for Link Deployer
 * Provides command-line interface for video platform operations
 * To be integrated with the application's integrated terminal
 */
export class LinkDeployerCLI {
  private processor: LinkProcessor;
  private commands: Map<string, CLICommand>;

  constructor() {
    this.processor = new LinkProcessor();
    this.commands = new Map();
    this.registerCommands();
  }

  /**
   * Register available CLI commands
   */
  private registerCommands(): void {
    this.commands.set('process', {
      name: 'process',
      description: 'Process a video URL',
      usage: 'process <url>',
      handler: this.handleProcess.bind(this)
    });

    this.commands.set('platforms', {
      name: 'platforms',
      description: 'List supported platforms',
      usage: 'platforms',
      handler: this.handlePlatforms.bind(this)
    });

    this.commands.set('detect', {
      name: 'detect',
      description: 'Detect platform from URL',
      usage: 'detect <url>',
      handler: this.handleDetect.bind(this)
    });

    this.commands.set('extract', {
      name: 'extract',
      description: 'Extract video ID from URL',
      usage: 'extract <url>',
      handler: this.handleExtract.bind(this)
    });

    this.commands.set('embed', {
      name: 'embed',
      description: 'Get embed data for URL',
      usage: 'embed <url>',
      handler: this.handleEmbed.bind(this)
    });

    this.commands.set('file', {
      name: 'file',
      description: 'Process URLs from file',
      usage: 'file <filepath>',
      handler: this.handleFile.bind(this)
    });

    this.commands.set('help', {
      name: 'help',
      description: 'Show help information',
      usage: 'help [command]',
      handler: this.handleHelp.bind(this)
    });

    this.commands.set('config', {
      name: 'config',
      description: 'Show configuration',
      usage: 'config',
      handler: this.handleConfig.bind(this)
    });
  }

  /**
   * Execute a CLI command
   */
  public async execute(commandLine: string): Promise<CLIResponse> {
    const [commandName, ...args] = commandLine.trim().split(/\s+/);

    if (!commandName) {
      return {
        success: false,
        message: 'No command provided. Type "help" for available commands.'
      };
    }

    const command = this.commands.get(commandName.toLowerCase());

    if (!command) {
      return {
        success: false,
        message: `Unknown command: ${commandName}. Type "help" for available commands.`
      };
    }

    try {
      return await command.handler(args);
    } catch (error: any) {
      return {
        success: false,
        message: `Error executing command: ${error.message}`
      };
    }
  }

  /**
   * Handle 'process' command
   */
  private async handleProcess(args: string[]): Promise<CLIResponse> {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: process <url>'
      };
    }

    const url = args[0];
    const processedUrl = await PlatformModules.processUrl(url);

    return {
      success: true,
      message: 'URL processed successfully',
      data: { processedUrl }
    };
  }

  /**
   * Handle 'platforms' command
   */
  private async handlePlatforms(_args: string[]): Promise<CLIResponse> {
    const platforms = PlatformModules.getSupportedPlatforms();

    return {
      success: true,
      message: `Supported platforms: ${platforms.join(', ')}`,
      data: { platforms }
    };
  }

  /**
   * Handle 'detect' command
   */
  private async handleDetect(args: string[]): Promise<CLIResponse> {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: detect <url>'
      };
    }

    const url = args[0];
    const platform = this.processor.detectPlatform(url);

    return {
      success: true,
      message: `Platform detected: ${platform || 'Unknown'}`,
      data: { platform }
    };
  }

  /**
   * Handle 'extract' command
   */
  private async handleExtract(args: string[]): Promise<CLIResponse> {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: extract <url>'
      };
    }

    const url = args[0];
    const module = PlatformModules.getModuleByUrl(url);

    if (!module) {
      return {
        success: false,
        message: 'No module found for this URL'
      };
    }

    const videoId = module.extractVideoId(url);

    return {
      success: true,
      message: `Video ID: ${videoId || 'Not found'}`,
      data: { videoId }
    };
  }

  /**
   * Handle 'embed' command
   */
  private async handleEmbed(args: string[]): Promise<CLIResponse> {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: embed <url>'
      };
    }

    const url = args[0];
    const embedData = await PlatformModules.getEmbedData(url);

    return {
      success: true,
      message: 'Embed data retrieved',
      data: embedData
    };
  }

  /**
   * Handle 'file' command
   */
  private async handleFile(args: string[]): Promise<CLIResponse> {
    if (args.length === 0) {
      return {
        success: false,
        message: 'Usage: file <filepath>'
      };
    }

    return {
      success: false,
      message: 'File processing not yet implemented in CLI'
    };
  }

  /**
   * Handle 'help' command
   */
  private async handleHelp(args: string[]): Promise<CLIResponse> {
    if (args.length > 0) {
      const commandName = args[0];
      const command = this.commands.get(commandName);

      if (!command) {
        return {
          success: false,
          message: `Unknown command: ${commandName}`
        };
      }

      return {
        success: true,
        message: `${command.name} - ${command.description}\nUsage: ${command.usage}`
      };
    }

    const helpText = Array.from(this.commands.values())
      .map(cmd => `  ${cmd.name.padEnd(12)} - ${cmd.description}`)
      .join('\n');

    return {
      success: true,
      message: `Available commands:\n${helpText}\n\nType "help <command>" for more information.`
    };
  }

  /**
   * Handle 'config' command
   */
  private async handleConfig(_args: string[]): Promise<CLIResponse> {
    const summary = HybridConfig.getSummary();
    const platforms = HybridConfig.getAllPlatforms();

    const configText = platforms
      .map((p: { name: any; enabled: any; priority: any; }) => `  ${p.name}: ${p.enabled ? 'enabled' : 'disabled'} (priority: ${p.priority})`)
      .join('\n');

    return {
      success: true,
      message: `${summary}\n\nPlatforms:\n${configText}`
    };
  }

  /**
   * Get all available commands
   */
  public getCommands(): CLICommand[] {
    return Array.from(this.commands.values());
  }
}

export interface CLICommand {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[]) => Promise<CLIResponse>;
}

export interface CLIResponse {
  success: boolean;
  message: string;
  data?: any;
}