# 🧪 Testing Guide - Playback Integration

## Manual Testing Checklist

### ✅ Basic Functionality Tests

#### Test 1: Common Playback Toggle
- [ ] Open Playback Integration panel
- [ ] Click "Disable Common"
- [ ] **Expected**: Controls bar disappears
- [ ] **Expected**: Video container expands to 600px
- [ ] **Expected**: Blue highlight on toggle item
- [ ] Click again to enable
- [ ] **Expected**: Controls bar reappears
- [ ] **Expected**: Video container resets to default

#### Test 2: Accessories Toggle
- [ ] Click "Disable Accessories"
- [ ] **Expected**: Hexagon bar disappears
- [ ] **Expected**: Video container expands to 700px
- [ ] **Expected**: Active state indicator appears
- [ ] Click again to enable
- [ ] **Expected**: Hexagon bar reappears

#### Test 3: Extensions Toggle
- [ ] Click "Disable Extension"
- [ ] **Expected**: Extension icon bar disappears
- [ ] **Expected**: Video container expands to 750px
- [ ] Click again to enable
- [ ] **Expected**: Extension bar reappears

#### Test 4: Playlist Toggle
- [ ] Click "Disable Playlist"
- [ ] **Expected**: Thumbnails scroll disappears
- [ ] **Expected**: Video container expands to 800px
- [ ] Click again to enable
- [ ] **Expected**: Playlist reappears

---

### ✅ Combination Tests

#### Test 5: Multiple Toggles
- [ ] Disable Common + Accessories
- [ ] **Expected**: Both hide, video at 700px
- [ ] Disable all four
- [ ] **Expected**: All hide, video at 800px
- [ ] Enable one by one
- [ ] **Expected**: Each reappears correctly

#### Test 6: Toggle Order
- [ ] Enable all controls
- [ ] Disable in order: Playlist → Extensions → Accessories → Common
- [ ] **Expected**: Each increases height correctly
- [ ] Enable in reverse order
- [ ] **Expected**: Each decreases height correctly

---

### ✅ Persistence Tests

#### Test 7: LocalStorage Persistence
- [ ] Disable Common and Accessories
- [ ] Refresh page (F5)
- [ ] **Expected**: Settings retained, controls still disabled
- [ ] Open DevTools → Application → LocalStorage
- [ ] **Expected**: See `playbackIntegrationSettings` key

#### Test 8: Cross-Session Persistence
- [ ] Disable all controls
- [ ] Close browser completely
- [ ] Reopen and navigate to app
- [ ] **Expected**: All controls still disabled

---

### ✅ Performance Tests

#### Test 9: Disabled Functionality
- [ ] Disable Common controls
- [ ] Try clicking on hidden control buttons
- [ ] **Expected**: No click events fire
- [ ] Check console
- [ ] **Expected**: No errors or warnings
- [ ] Open DevTools → Performance tab
- [ ] Record while toggling
- [ ] **Expected**: Smooth 60fps, no jank

#### Test 10: Memory Leaks
- [ ] Toggle each control 20 times rapidly
- [ ] Open DevTools → Memory → Take heap snapshot
- [ ] **Expected**: Memory usage stable (< 10MB increase)

---

### ✅ UI/UX Tests

#### Test 11: Visual Feedback
- [ ] Hover over each toggle item
- [ ] **Expected**: Background color changes
- [ ] Click each toggle
- [ ] **Expected**: Ripple effect visible (if CSS applied)
- [ ] **Expected**: Icon color changes
- [ ] **Expected**: Toggle dot glows when active

#### Test 12: Animations
- [ ] Watch video container expansion
- [ ] **Expected**: Smooth height transition
- [ ] Toggle controls quickly
- [ ] **Expected**: No animation glitches
- [ ] Check for stuttering
- [ ] **Expected**: Butter-smooth 60fps

---

### ✅ Accessibility Tests

#### Test 13: Keyboard Navigation
- [ ] Use Tab key to navigate integration panel
- [ ] **Expected**: Focus visible on each toggle
- [ ] Press Space/Enter to toggle
- [ ] **Expected**: Toggle activates
- [ ] Press Esc key
- [ ] **Expected**: Panel closes (if implemented)

#### Test 14: Screen Reader
- [ ] Enable screen reader (NVDA/JAWS/VoiceOver)
- [ ] Navigate to integration panel
- [ ] **Expected**: Each toggle announced correctly
- [ ] **Expected**: State (enabled/disabled) announced

---

### ✅ Browser Compatibility Tests

#### Test 15: Chrome
- [ ] All basic functionality works
- [ ] Animations smooth
- [ ] No console errors

#### Test 16: Firefox
- [ ] All basic functionality works
- [ ] Check for display issues
- [ ] Verify localStorage works

#### Test 17: Safari
- [ ] All basic functionality works
- [ ] Check backdrop-filter support
- [ ] Verify animations

#### Test 18: Edge
- [ ] All basic functionality works
- [ ] Check for compatibility issues

---

### ✅ Responsive Tests

#### Test 19: Desktop (1920x1080)
- [ ] Integration panel positioned correctly
- [ ] All text readable
- [ ] No overflow issues

#### Test 20: Tablet (768x1024)
- [ ] Panel adjusts position
- [ ] Touch targets adequate (min 44x44px)
- [ ] No horizontal scroll

#### Test 21: Mobile (375x667)
- [ ] Panel width adjusts
- [ ] All toggles accessible
- [ ] Text still readable

---

### ✅ Edge Cases

#### Test 22: Rapid Toggling
- [ ] Click same toggle 10 times rapidly
- [ ] **Expected**: State consistent
- [ ] **Expected**: No visual glitches
- [ ] **Expected**: No console errors

#### Test 23: LocalStorage Full
- [ ] Fill localStorage to quota
- [ ] Try toggling controls
- [ ] **Expected**: Graceful degradation
- [ ] **Expected**: Console warning (not error)

#### Test 24: Missing DOM Elements
- [ ] Remove `.controls-bar` from DOM
- [ ] Try toggling Common
- [ ] **Expected**: No errors
- [ ] **Expected**: Console log indicating missing element

---

## Automated Test Scenarios

### Unit Test Example (Jest/Vitest)

```typescript
import { CommonPlaybackIntegration } from './commonPlayback.script';

describe('CommonPlaybackIntegration', () => {
  let integration: CommonPlaybackIntegration;
  
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div class="controls-bar"></div>
      <div class="video-container"></div>
      <video class="video-player-theater-stage"></video>
    `;
    integration = new CommonPlaybackIntegration();
  });
  
  test('disables controls', () => {
    integration.disable();
    const controlsBar = document.querySelector('.controls-bar') as HTMLElement;
    expect(controlsBar.style.display).toBe('none');
  });
  
  test('expands video container', () => {
    integration.disable();
    const container = document.querySelector('.video-container') as HTMLElement;
    expect(container.style.maxHeight).toBe('600px');
  });
  
  test('toggles state', () => {
    expect(integration.getState()).toBe(false);
    integration.toggle();
    expect(integration.getState()).toBe(true);
  });
});
```

### Integration Test Example

```typescript
import { playbackIntegrationRegistry } from './index.PlaybackIntegration.script';

describe('PlaybackIntegrationRegistry', () => {
  beforeEach(() => {
    localStorage.clear();
    // Setup full DOM
  });
  
  test('persists settings to localStorage', () => {
    playbackIntegrationRegistry.toggle('disableCommon');
    const saved = localStorage.getItem('playbackIntegrationSettings');
    expect(JSON.parse(saved).disableCommon).toBe(true);
  });
  
  test('calculates correct height for multiple disabled', () => {
    playbackIntegrationRegistry.toggle('disableCommon');
    playbackIntegrationRegistry.toggle('disableAccessories');
    const container = document.querySelector('.video-container') as HTMLElement;
    expect(container.style.maxHeight).toBe('700px');
  });
});
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Method |
|--------|--------|--------|
| Toggle Response Time | < 16ms | DevTools Performance |
| Animation Frame Rate | 60fps | FPS meter |
| Memory Usage (idle) | < 50MB | DevTools Memory |
| Memory Usage (active) | < 100MB | DevTools Memory |
| LocalStorage Write Time | < 5ms | Console.time() |
| Initial Load Time | < 100ms | Performance API |

### Measuring Performance

```javascript
// Toggle response time
console.time('toggle');
playbackIntegrationRegistry.toggle('disableCommon');
console.timeEnd('toggle');

// Memory usage
const memBefore = performance.memory.usedJSHeapSize;
// Perform actions
const memAfter = performance.memory.usedJSHeapSize;
console.log('Memory delta:', (memAfter - memBefore) / 1024 / 1024, 'MB');

// FPS
let lastTime = performance.now();
let frames = 0;
function measureFPS() {
  frames++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    console.log('FPS:', frames);
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(measureFPS);
}
measureFPS();
```

---

## Bug Report Template

```markdown
### Bug Description
[Clear description of the issue]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [...]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Environment
- Browser: [Chrome 120, Firefox 121, etc.]
- OS: [Windows 11, macOS 14, etc.]
- Screen Size: [1920x1080, etc.]

### Console Errors
```
[Paste any console errors]
```

### Screenshots
[Attach screenshots if applicable]

### Additional Context
[Any other relevant information]
```

---

## Test Results Log

| Date | Tester | Test # | Result | Notes |
|------|--------|--------|--------|-------|
| 2026-02-15 | [Name] | 1-4 | ✅ Pass | All basic toggles work |
| 2026-02-15 | [Name] | 5-6 | ✅ Pass | Combinations work correctly |
| ... | ... | ... | ... | ... |

---

## Continuous Testing

### Pre-Release Checklist
- [ ] All manual tests pass
- [ ] All automated tests pass
- [ ] Performance benchmarks met
- [ ] Accessibility verified
- [ ] Cross-browser tested
- [ ] Responsive design verified
- [ ] Code review completed
- [ ] Documentation updated

---

**Testing is crucial for production quality. Don't skip steps!** 🎯
