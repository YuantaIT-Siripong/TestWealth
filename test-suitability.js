// Test script for suitability API
const testCases = [
  { clientId: 'CLI-001', productId: 'PROD-002', expected: 'Pass', reason: 'Medium risk client (CLI-001) with Low risk product (Conservative Bond Fund)' },
  { clientId: 'CLI-001', productId: 'PROD-001', expected: 'Pass', reason: 'Medium risk client (CLI-001) with Medium risk product (Growth Fund A)' },
  { clientId: 'CLI-001', productId: 'PROD-003', expected: 'Fail', reason: 'Medium risk client (CLI-001) with High risk product (Equity Growth Portfolio)' },
  { clientId: 'CLI-002', productId: 'PROD-003', expected: 'Pass', reason: 'High risk client (CLI-002) with High risk product (Equity Growth Portfolio)' },
  { clientId: 'CLI-002', productId: 'PROD-001', expected: 'Pass', reason: 'High risk client (CLI-002) with Medium risk product (Growth Fund A)' },
  { clientId: 'CLI-008', productId: 'PROD-002', expected: 'Pass', reason: 'Low risk client (CLI-008) with Low risk product (Conservative Bond Fund)' },
  { clientId: 'CLI-008', productId: 'PROD-001', expected: 'Fail', reason: 'Low risk client (CLI-008) with Medium risk product (Growth Fund A)' },
];

async function testSuitability() {
  console.log('Testing Suitability API\n');
  console.log('=' .repeat(80));
  
  for (const testCase of testCases) {
    const url = `http://localhost:3000/api/suitability/check?clientId=${testCase.clientId}&productId=${testCase.productId}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      const status = data.data.isSuitable ? 'Pass' : 'Fail';
      const emoji = status === testCase.expected ? '✅' : '❌';
      
      console.log(`\n${emoji} Test: ${testCase.reason}`);
      console.log(`   Client: ${testCase.clientId} | Product: ${testCase.productId}`);
      console.log(`   Client Risk: ${data.data.clientRisk} | Product Risk: ${data.data.productRisk}`);
      console.log(`   Result: ${status} (Expected: ${testCase.expected})`);
      console.log(`   Reason: ${data.data.reason}`);
    } catch (error) {
      console.error(`❌ Error testing ${testCase.clientId}:`, error.message);
    }
  }
  
  console.log('\n' + '='.repeat(80));
}

testSuitability();
