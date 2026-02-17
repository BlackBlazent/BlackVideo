/*
 * 
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 *
 * 
 * Run this in your browser console to test the dropper functionality
 */

class YouTubeDropperTests {
  constructor() {
    this.results = [];
    this.proxyUrl = 'http://localhost:9292';
  }

  /**
   * Run all tests
   */
  async runAll() {
    console.log('🧪 Starting BlackVideo YouTube Dropper Tests...\n');
    
    await this.testProxyHealth();
    await this.testUrlParsing();
    await this.testVideoInfo();
    await this.testStreamUrl();
    
    this.printResults();
  }

  /**
   * Test 1: Proxy Server Health Check
   */
  async testProxyHealth() {
    console.log('Test 1: Proxy Health Check...');
    try {
      const response = await fetch(`${this.proxyUrl}/health`);
      const data = await response.json();
      
      if (data.status === 'ok') {
        this.pass('Proxy server is running');
      } else {
        this.fail('Proxy server returned unexpected status');
      }
    } catch (error) {
      this.fail(`Proxy server not accessible: ${error.message}`);
    }
  }

  /**
   * Test 2: URL Parsing
   */
  async testUrlParsing() {
    console.log('\nTest 2: URL Parsing...');
    
    const testUrls = [
      {
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ',
        type: 'Standard watch URL'
      },
      {
        url: 'https://youtu.be/dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ',
        type: 'Short URL'
      },
      {
        url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ',
        type: 'Shorts URL'
      },
      {
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        expected: 'dQw4w9WgXcQ',
        type: 'Embed URL'
      }
    ];

    for (const test of testUrls) {
      try {
        const urlObj = new URL(test.url);
        let videoId = null;

        if (urlObj.hostname.includes('youtube.com')) {
          if (urlObj.pathname === '/watch') {
            videoId = urlObj.searchParams.get('v');
          } else if (urlObj.pathname.startsWith('/shorts/')) {
            videoId = urlObj.pathname.split('/')[2];
          } else if (urlObj.pathname.startsWith('/embed/')) {
            videoId = urlObj.pathname.split('/')[2];
          }
        } else if (urlObj.hostname === 'youtu.be') {
          videoId = urlObj.pathname.split('/')[1];
        }

        if (videoId === test.expected) {
          this.pass(`${test.type}: Correctly parsed video ID`);
        } else {
          this.fail(`${test.type}: Got ${videoId}, expected ${test.expected}`);
        }
      } catch (error) {
        this.fail(`${test.type}: ${error.message}`);
      }
    }
  }

  /**
   * Test 3: Video Info Fetching
   */
  async testVideoInfo() {
    console.log('\nTest 3: Video Info Fetching...');
    const testVideoId = 'dQw4w9WgXcQ'; // Rick Astley - Never Gonna Give You Up

    try {
      const response = await fetch(`${this.proxyUrl}/info/${testVideoId}`);
      const data = await response.json();

      if (data.videoId) {
        this.pass('Video ID returned');
      } else {
        this.fail('No video ID in response');
      }

      if (data.title) {
        this.pass(`Video title: "${data.title}"`);
      } else {
        this.fail('No title in response');
      }

      if (data.duration) {
        this.pass(`Duration: ${data.duration} seconds`);
      } else {
        this.fail('No duration in response');
      }

    } catch (error) {
      this.fail(`Info fetch failed: ${error.message}`);
    }
  }

  /**
   * Test 4: Stream URL Generation
   */
  async testStreamUrl() {
    console.log('\nTest 4: Stream URL Generation...');
    const testVideoId = 'dQw4w9WgXcQ';

    try {
      const streamUrl = `${this.proxyUrl}/stream/${testVideoId}`;
      this.pass(`Stream URL generated: ${streamUrl}`);

      // Test if stream endpoint responds (HEAD request)
      const response = await fetch(streamUrl, { method: 'HEAD' });
      
      if (response.ok) {
        this.pass('Stream endpoint is accessible');
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('video')) {
          this.pass(`Content-Type: ${contentType}`);
        } else {
          this.fail(`Unexpected Content-Type: ${contentType}`);
        }
      } else {
        this.fail(`Stream endpoint returned ${response.status}`);
      }

    } catch (error) {
      this.fail(`Stream URL test failed: ${error.message}`);
    }
  }

  /**
   * Helper: Mark test as passed
   */
  pass(message) {
    this.results.push({ status: '✅', message });
    console.log(`  ✅ ${message}`);
  }

  /**
   * Helper: Mark test as failed
   */
  fail(message) {
    this.results.push({ status: '❌', message });
    console.error(`  ❌ ${message}`);
  }

  /**
   * Print test summary
   */
  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 Test Results Summary\n');
    
    const passed = this.results.filter(r => r.status === '✅').length;
    const failed = this.results.filter(r => r.status === '❌').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed!');
    } else {
      console.log('\n⚠️ Some tests failed. Check the details above.');
    }
    
    console.log('='.repeat(60));
  }
}

// Auto-run tests
const tests = new YouTubeDropperTests();
tests.runAll();

/**
 * Manual Testing Checklist
 * Copy and paste each test in your browser console
 */

// Test 1: Check proxy health
// fetch('http://localhost:9292/health').then(r => r.json()).then(console.log);

// Test 2: Get video info
// fetch('http://localhost:9292/info/dQw4w9WgXcQ').then(r => r.json()).then(console.log);

// Test 3: Validate video ID
// fetch('http://localhost:9292/validate/dQw4w9WgXcQ').then(r => r.json()).then(console.log);

// Test 4: Test stream URL (this will start downloading, be careful)
// window.open('http://localhost:9292/stream/dQw4w9WgXcQ');

/**
 * Integration Test: Simulate Drag & Drop
 */
function simulateDragDrop(videoUrl) {
  const container = document.getElementById('videoContainer');
  const videoElement = document.getElementById('VideoPlayer-TheaterStage');

  if (!container || !videoElement) {
    console.error('Container or video element not found');
    return;
  }

  // Create drop event
  const dropEvent = new DragEvent('drop', {
    bubbles: true,
    cancelable: true,
    dataTransfer: new DataTransfer()
  });

  // Add URL to data transfer
  dropEvent.dataTransfer.setData('text/plain', videoUrl);

  // Dispatch event
  container.dispatchEvent(dropEvent);
  
  console.log(`✅ Simulated drop of: ${videoUrl}`);
}

// Example usage:
// simulateDragDrop('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

/**
 * Performance Test: Measure load times
 */
async function performanceTest(videoId) {
  console.log('⏱️ Starting performance test...');
  
  const startInfo = performance.now();
  await fetch(`http://localhost:9292/info/${videoId}`).then(r => r.json());
  const infoTime = performance.now() - startInfo;
  
  console.log(`ℹ️ Info fetch: ${infoTime.toFixed(2)}ms`);
  
  const startStream = performance.now();
  await fetch(`http://localhost:9292/stream/${videoId}`, { method: 'HEAD' });
  const streamTime = performance.now() - startStream;
  
  console.log(`🎬 Stream init: ${streamTime.toFixed(2)}ms`);
  console.log(`📊 Total: ${(infoTime + streamTime).toFixed(2)}ms`);
}

// Example usage:
// performanceTest('dQw4w9WgXcQ');
