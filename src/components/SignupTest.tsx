import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SignupTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const { signup } = useAuth();

  const testSignup = async () => {
    setTestResult('Testing signup...');
    
    const testData = {
      email: 'test@example.com',
      password: 'test123456',
      name: 'Test Parent',
      phone: '555-1234',
      students: [
        {
          name: 'Test Student',
          age: 12,
          grade: '7th'
        }
      ]
    };

    try {
      const result = await signup(testData);
      if (result.success) {
        setTestResult('✅ Signup successful! Check console for details.');
      } else {
        setTestResult(`❌ Signup failed: ${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ Signup error: ${error}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs">
      <h3 className="font-semibold mb-2">Signup Test</h3>
      <button
        onClick={testSignup}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 mb-2 w-full"
      >
        Test Signup
      </button>
      {testResult && (
        <div className="text-xs bg-gray-100 p-2 rounded">
          {testResult}
        </div>
      )}
    </div>
  );
};

export default SignupTest;