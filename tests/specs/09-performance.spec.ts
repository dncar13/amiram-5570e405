import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { SimulationPage } from '../pages/SimulationPage';

test.describe('בדיקות ביצועים', () => {
  test.describe('Core Web Vitals', () => {
    test('מדידת LCP, FID, CLS', async ({ page }) => {
      await page.goto('/');
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          let lcpValue = null;
          let clsValue = 0;
          let fidValue = null;
          
          // LCP Observer
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcpValue = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // CLS Observer
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          
          // FID Observer
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              fidValue = entries[0].processingStart - entries[0].startTime;
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
          
          // Get FCP
          const fcpEntry = performance.getEntriesByType('paint')
            .find(entry => entry.name === 'first-contentful-paint');
          const fcpValue = fcpEntry ? fcpEntry.startTime : null;
          
          // Resolve after timeout
          setTimeout(() => {
            lcpObserver.disconnect();
            clsObserver.disconnect();
            fidObserver.disconnect();
            
            resolve({
              LCP: lcpValue,
              FCP: fcpValue,
              CLS: clsValue,
              FID: fidValue
            });
          }, 5000);
        });
      });
      
      console.log('Core Web Vitals:', metrics);
      
      // Assertions
      if (metrics.LCP !== null) {
        expect(metrics.LCP).toBeLessThan(2500); // Good LCP
        console.log(`✅ LCP: ${metrics.LCP.toFixed(2)}ms`);
      }
      
      if (metrics.FCP !== null) {
        expect(metrics.FCP).toBeLessThan(1800); // Good FCP
        console.log(`✅ FCP: ${metrics.FCP.toFixed(2)}ms`);
      }
      
      if (metrics.CLS !== null) {
        expect(metrics.CLS).toBeLessThan(0.1); // Good CLS
        console.log(`✅ CLS: ${metrics.CLS.toFixed(3)}`);
      }
      
      console.log(`ℹ️ FID: ${metrics.FID !== null ? metrics.FID.toFixed(2) + 'ms' : 'No interaction detected'}`);
    });

    test('מדידת זמני טעינה כלליים', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      
      const domLoadTime = Date.now() - startTime;
      
      await page.waitForLoadState('networkidle');
      const fullLoadTime = Date.now() - startTime;
      
      console.log(`DOM Load Time: ${domLoadTime}ms`);
      console.log(`Full Load Time: ${fullLoadTime}ms`);
      
      // DOM should load within 3 seconds
      expect(domLoadTime).toBeLessThan(3000);
      
      // Full load should complete within 5 seconds
      expect(fullLoadTime).toBeLessThan(5000);
    });
  });

  test.describe('ביצועי סימולציה', () => {
    test('זמן טעינת שאלות', async ({ page }) => {
      const simulationPage = new SimulationPage(page);
      await simulationPage.goto();
      
      const startTime = Date.now();
      await simulationPage.startPracticeSimulation();
      
      // Wait for first question to appear
      await page.waitForSelector('[data-testid="question-text"], .question-text', { timeout: 10000 });
      const questionLoadTime = Date.now() - startTime;
      
      console.log(`Question Load Time: ${questionLoadTime}ms`);
      
      // Questions should load within 2 seconds
      expect(questionLoadTime).toBeLessThan(2000);
    });

    test('ביצועי מעבר בין שאלות', async ({ page }) => {
      const simulationPage = new SimulationPage(page);
      await simulationPage.goto();
      await simulationPage.startPracticeSimulation();
      
      // Wait for first question
      await page.waitForSelector('[data-testid="question-text"], .question-text');
      
      const transitionTimes: number[] = [];
      
      // Test 5 question transitions
      for (let i = 0; i < 5; i++) {
        if (await simulationPage.answerOptions.first().isVisible()) {
          await simulationPage.selectAnswer(0);
          await simulationPage.submitAnswer();
          
          if (await simulationPage.nextButton.isVisible()) {
            const startTime = Date.now();
            await simulationPage.goToNextQuestion();
            
            // Wait for next question to load
            await page.waitForFunction(() => {
              const questionElement = document.querySelector('[data-testid="question-text"], .question-text');
              return questionElement && questionElement.textContent !== '';
            }, { timeout: 5000 });
            
            const transitionTime = Date.now() - startTime;
            transitionTimes.push(transitionTime);
            
            console.log(`Transition ${i + 1}: ${transitionTime}ms`);
          } else {
            break; // No more questions
          }
        } else {
          break;
        }
      }
      
      if (transitionTimes.length > 0) {
        const avgTransitionTime = transitionTimes.reduce((a, b) => a + b) / transitionTimes.length;
        console.log(`Average Transition Time: ${avgTransitionTime}ms`);
        
        // Transitions should be under 500ms
        expect(avgTransitionTime).toBeLessThan(500);
        
        // No single transition should take more than 1 second
        transitionTimes.forEach(time => {
          expect(time).toBeLessThan(1000);
        });
      }
    });
  });

  test.describe('ביצועי רשת', () => {
    test('מדידת גודל העמוד והשעה', async ({ page }) => {
      let totalSize = 0;
      const resourceCounts = {
        images: 0,
        scripts: 0,
        stylesheets: 0,
        fonts: 0,
        other: 0
      };
      
      page.on('response', response => {
        const contentLength = response.headers()['content-length'];
        if (contentLength) {
          totalSize += parseInt(contentLength);
        }
        
        const url = response.url();
        if (url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
          resourceCounts.images++;
        } else if (url.match(/\.js$/i)) {
          resourceCounts.scripts++;
        } else if (url.match(/\.css$/i)) {
          resourceCounts.stylesheets++;
        } else if (url.match(/\.(woff|woff2|ttf|eot)$/i)) {
          resourceCounts.fonts++;
        } else {
          resourceCounts.other++;
        }
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      console.log('Resource Counts:', resourceCounts);
      console.log(`Total Size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
      
      // Page should be under 5MB total
      expect(totalSize).toBeLessThan(5 * 1024 * 1024);
      
      // Reasonable resource counts
      expect(resourceCounts.images).toBeLessThan(20);
      expect(resourceCounts.scripts).toBeLessThan(15);
      expect(resourceCounts.stylesheets).toBeLessThan(10);
    });

    test('בדיקת caching', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const firstLoadTime = Date.now();
      await page.reload();
      await page.waitForLoadState('networkidle');
      const reloadTime = Date.now() - firstLoadTime;
      
      console.log(`Reload Time: ${reloadTime}ms`);
      
      // Reload should be faster due to caching
      expect(reloadTime).toBeLessThan(2000);
    });
  });

  test.describe('Memory Usage', () => {
    test('בדיקת שימוש בזיכרון לאורך זמן', async ({ page }) => {
      const getMemoryUsage = async () => {
        return await page.evaluate(() => {
          const memory = (performance as any).memory;
          return {
            used: memory?.usedJSHeapSize || 0,
            total: memory?.totalJSHeapSize || 0,
            limit: memory?.jsHeapSizeLimit || 0
          };
        });
      };
      
      await page.goto('/');
      const initialMemory = await getMemoryUsage();
      
      // Navigate through several pages
      const pages = ['/', '/about', '/contact', '/login', '/'];
      for (const pagePath of pages) {
        await page.goto(pagePath);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000); // Allow memory to settle
      }
      
      const finalMemory = await getMemoryUsage();
      const memoryIncrease = finalMemory.used - initialMemory.used;
      
      console.log('Memory Usage:');
      console.log(`Initial: ${(initialMemory.used / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Final: ${(finalMemory.used / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)} MB`);
      
      // Memory increase should be reasonable (under 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });

    test('בדיקת זיכרון בסימולציה מתמשכת', async ({ page }) => {
      const simulationPage = new SimulationPage(page);
      
      const getMemoryUsage = async () => {
        return await page.evaluate(() => {
          return (performance as any).memory?.usedJSHeapSize || 0;
        });
      };
      
      await simulationPage.goto();
      const startMemory = await getMemoryUsage();
      
      // Run multiple simulation cycles
      for (let cycle = 0; cycle < 3; cycle++) {
        await simulationPage.startPracticeSimulation();
        
        // Answer several questions
        for (let q = 0; q < 5; q++) {
          if (await simulationPage.answerOptions.first().isVisible()) {
            await simulationPage.selectAnswer(0);
            await simulationPage.submitAnswer();
            
            if (await simulationPage.nextButton.isVisible()) {
              await simulationPage.goToNextQuestion();
            } else {
              break;
            }
          } else {
            break;
          }
        }
        
        // Go back to start
        await simulationPage.goto();
        await page.waitForTimeout(1000);
      }
      
      const endMemory = await getMemoryUsage();
      const memoryLeak = endMemory - startMemory;
      
      console.log(`Simulation Memory Usage:`);
      console.log(`Start: ${(startMemory / 1024 / 1024).toFixed(2)} MB`);
      console.log(`End: ${(endMemory / 1024 / 1024).toFixed(2)} MB`);
      console.log(`Potential Leak: ${(memoryLeak / 1024 / 1024).toFixed(2)} MB`);
      
      // Should not leak more than 30MB
      expect(memoryLeak).toBeLessThan(30 * 1024 * 1024);
    });
  });

  test.describe('CPU Performance', () => {
    test('בדיקת זמני עיבוד JavaScript', async ({ page }) => {
      await page.goto('/');
      
      // Measure JavaScript execution time
      const jsExecutionTime = await page.evaluate(() => {
        const start = performance.now();
        
        // Simulate some heavy computation
        let result = 0;
        for (let i = 0; i < 100000; i++) {
          result += Math.random();
        }
        
        return performance.now() - start;
      });
      
      console.log(`JS Execution Time: ${jsExecutionTime}ms`);
      
      // JS execution should be reasonable
      expect(jsExecutionTime).toBeLessThan(100);
    });
  });

  test.describe('דוח ביצועים מקיף', () => {
    test('דוח ביצועים כללי', async ({ page }) => {
      const homePage = new HomePage(page);
      
      const performanceData = {
        pageLoadTime: 0,
        resourceCount: 0,
        memoryUsage: 0,
        errors: 0
      };
      
      const errors: string[] = [];
      page.on('pageerror', error => {
        errors.push(error.message);
        performanceData.errors++;
      });
      
      let resourceCount = 0;
      page.on('response', () => {
        resourceCount++;
      });
      
      const startTime = Date.now();
      await homePage.goto();
      await page.waitForLoadState('networkidle');
      performanceData.pageLoadTime = Date.now() - startTime;
      
      performanceData.resourceCount = resourceCount;
      
      if ((performance as any).memory) {
        performanceData.memoryUsage = await page.evaluate(() => {
          return (performance as any).memory.usedJSHeapSize;
        });
      }
      
      console.log('Performance Report:', {
        ...performanceData,
        memoryUsage: `${(performanceData.memoryUsage / 1024 / 1024).toFixed(2)} MB`,
        errors: errors
      });
      
      // Performance thresholds
      expect(performanceData.pageLoadTime).toBeLessThan(5000);
      expect(performanceData.resourceCount).toBeLessThan(50);
      expect(performanceData.errors).toBe(0);
      
      if (performanceData.memoryUsage > 0) {
        expect(performanceData.memoryUsage).toBeLessThan(100 * 1024 * 1024); // 100MB
      }
    });
  });
});
