// Simple test to verify dashboard-backend connection
// Run this in browser console on http://localhost:3000

console.log('🧪 Testing Dashboard-Backend Connection...');

// Test 1: Direct backend health check
fetch('http://localhost:5001/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend Health Check:', data);
    console.log('   Status:', data.status);
    console.log('   Services:', data.services);
    console.log('   Language:', data.language.current_language);
  })
  .catch(error => {
    console.error('❌ Backend Health Check Failed:', error);
  });

// Test 2: Performance metrics
fetch('http://localhost:5001/performance')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Performance Metrics:', data);
  })
  .catch(error => {
    console.error('❌ Performance Metrics Failed:', error);
  });

// Test 3: Language info
fetch('http://localhost:5001/language')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Language Info:', data);
  })
  .catch(error => {
    console.error('❌ Language Info Failed:', error);
  });

console.log('🔍 Check console for results...');
