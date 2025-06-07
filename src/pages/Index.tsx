
import { useState } from 'react';
import TransactionForm from '@/components/TransactionForm';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg min-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
            <h1 className="text-xl font-semibold text-center">Personal Finance</h1>
          </div>
          
          {/* Main Content */}
          <div className="p-4">
            <TransactionForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
