// testNetwork.js
// Run this file to diagnose network connectivity issues
// Usage: node testNetwork.js

import dns from 'dns';
import https from 'https';
import axios from 'axios';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);
const resolve4 = promisify(dns.resolve4);

console.log("🔍 Network Diagnostics for OpenRouter API\n");
console.log("=" .repeat(50));

async function testDNS() {
  console.log("\n1️⃣ Testing DNS Resolution...");
  
  try {
    // Test basic DNS lookup
    const result = await lookup('openrouter.ai');
    console.log("✅ DNS Lookup successful!");
    console.log("   IP Address:", result.address);
    console.log("   Family:", result.family === 4 ? "IPv4" : "IPv6");
    
    // Test DNS resolution
    const ips = await resolve4('openrouter.ai');
    console.log("   All IPs:", ips.join(", "));
    
    return true;
  } catch (err) {
    console.error("❌ DNS Resolution failed!");
    console.error("   Error:", err.message);
    console.error("\n   Possible causes:");
    console.error("   - No internet connection");
    console.error("   - DNS server issues");
    console.error("   - Firewall blocking DNS requests");
    console.error("\n   Solutions:");
    console.error("   - Check your internet connection");
    console.error("   - Try changing DNS servers (8.8.8.8, 1.1.1.1)");
    console.error("   - Disable VPN temporarily");
    return false;
  }
}

async function testHTTPS() {
  console.log("\n2️⃣ Testing HTTPS Connection...");
  
  return new Promise((resolve) => {
    const req = https.get('https://openrouter.ai', (res) => {
      console.log("✅ HTTPS Connection successful!");
      console.log("   Status Code:", res.statusCode);
      console.log("   Status Message:", res.statusMessage);
      resolve(true);
      res.resume(); // Consume response
    });

    req.on('error', (err) => {
      console.error("❌ HTTPS Connection failed!");
      console.error("   Error:", err.message);
      console.error("   Code:", err.code);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.error("❌ HTTPS Connection timeout!");
      resolve(false);
    });
  });
}

async function testAPI() {
  console.log("\n3️⃣ Testing OpenRouter API Endpoint...");
  
  // Don't include API key in test - just check if endpoint is reachable
  try {
    const response = await axios.get('https://openrouter.ai/api/v1/models', {
      timeout: 10000,
      validateStatus: () => true // Accept any status
    });
    
    console.log("✅ API Endpoint reachable!");
    console.log("   Status:", response.status);
    
    if (response.status === 401 || response.status === 403) {
      console.log("   (401/403 is expected without API key - endpoint is working)");
    }
    
    return true;
  } catch (err) {
    console.error("❌ API Endpoint unreachable!");
    console.error("   Error:", err.code || err.message);
    return false;
  }
}

async function testWithAPIKey() {
  console.log("\n4️⃣ Testing with API Key...");
  
  // Load environment variables
  const { config } = await import('dotenv');
  config();
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    console.log("⚠️  No API key found in .env file");
    return false;
  }
  
  console.log("   API Key found:", apiKey.substring(0, 10) + "...");
  
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'test' }],
        max_tokens: 5
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Network-Test'
        },
        timeout: 15000
      }
    );
    
    console.log("✅ API Request successful!");
    console.log("   Model:", response.data.model);
    console.log("   Response:", response.data.choices[0].message.content);
    return true;
  } catch (err) {
    if (err.response) {
      console.error("❌ API Request failed with HTTP error");
      console.error("   Status:", err.response.status);
      console.error("   Error:", err.response.data?.error?.message || err.response.statusText);
      
      if (err.response.status === 402) {
        console.log("\n   💡 This is a credits issue - add funds to OpenRouter account");
      } else if (err.response.status === 401) {
        console.log("\n   💡 Invalid API key - check your .env file");
      }
    } else if (err.code === 'ENOTFOUND') {
      console.error("❌ DNS Resolution failed");
      console.error("   Cannot resolve openrouter.ai");
    } else {
      console.error("❌ Request failed");
      console.error("   Error:", err.message);
      console.error("   Code:", err.code);
    }
    return false;
  }
}

async function checkProxy() {
  console.log("\n5️⃣ Checking Proxy Settings...");
  
  const httpProxy = process.env.HTTP_PROXY || process.env.http_proxy;
  const httpsProxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  
  if (httpProxy || httpsProxy) {
    console.log("⚠️  Proxy detected:");
    if (httpProxy) console.log("   HTTP_PROXY:", httpProxy);
    if (httpsProxy) console.log("   HTTPS_PROXY:", httpsProxy);
    console.log("\n   Note: Proxies can interfere with API requests");
  } else {
    console.log("✅ No proxy configured");
  }
}

async function checkSystemInfo() {
  console.log("\n6️⃣ System Information...");
  console.log("   Platform:", process.platform);
  console.log("   Node Version:", process.version);
  console.log("   Network Interfaces:");
  
  const os = await import('os');
  const interfaces = os.networkInterfaces();
  
  Object.keys(interfaces).forEach(name => {
    const addrs = interfaces[name].filter(addr => !addr.internal);
    if (addrs.length > 0) {
      console.log(`   - ${name}:`, addrs.map(a => a.address).join(", "));
    }
  });
}

// Run all tests
async function runDiagnostics() {
  try {
    await checkSystemInfo();
    await checkProxy();
    
    const dnsOk = await testDNS();
    if (!dnsOk) {
      console.log("\n❌ DNS resolution failed - cannot proceed with other tests");
      console.log("\nQuick fixes to try:");
      console.log("1. Check internet connection: ping google.com");
      console.log("2. Flush DNS cache:");
      console.log("   Windows: ipconfig /flushdns");
      console.log("   Mac: sudo dscacheutil -flushcache");
      console.log("   Linux: sudo systemd-resolve --flush-caches");
      console.log("3. Try different DNS servers (8.8.8.8, 1.1.1.1)");
      return;
    }
    
    const httpsOk = await testHTTPS();
    if (!httpsOk) {
      console.log("\n❌ HTTPS connection failed - check firewall/antivirus");
      return;
    }
    
    await testAPI();
    await testWithAPIKey();
    
    console.log("\n" + "=".repeat(50));
    console.log("✅ Diagnostics complete!\n");
    
  } catch (err) {
    console.error("\n❌ Diagnostic error:", err.message);
  }
}

runDiagnostics();