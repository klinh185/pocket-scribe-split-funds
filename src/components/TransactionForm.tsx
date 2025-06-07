
import { useState } from 'react';
import { Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import SplitAmountSection from './SplitAmountSection';

const TransactionForm = () => {
  const [transactionType, setTransactionType] = useState('');
  const [cashTransaction, setCashTransaction] = useState('');
  const [category, setCategory] = useState('');
  const [savingFlow, setSavingFlow] = useState('');
  const [repaymentParty, setRepaymentParty] = useState('');
  const [amountYouOwe, setAmountYouOwe] = useState(0);
  const [amountOwedToYou, setAmountOwedToYou] = useState(0);

  const handleSave = () => {
    console.log('Transaction saved:', {
      type: transactionType,
      cashTransaction,
      category,
      amountYouOwe,
      amountOwedToYou,
      savingFlow,
      repaymentParty
    });
  };

  const getCategoryOptions = () => {
    switch (transactionType) {
      case 'Income':
        return ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
      case 'Expense':
        return ['Food', 'Utilities', 'Transport', 'Entertainment', 'Healthcare', 'Shopping'];
      case 'Saving':
        return ['Emergency Fund', 'Investment', 'Vacation', 'Education', 'Other'];
      case 'Repayment':
        return ['Loan', 'Credit Card', 'Personal Debt', 'Other'];
      default:
        return [];
    }
  };

  const calculatePersonalTrackedAmount = () => {
    const cash = parseFloat(cashTransaction) || 0;
    const youOwe = amountYouOwe;
    const owedToYou = amountOwedToYou;

    if (transactionType === 'Income') {
      return cash - youOwe + owedToYou;
    } else if (transactionType === 'Expense') {
      return cash + youOwe - owedToYou;
    }
    return cash;
  };

  const renderTypeSpecificFields = () => {
    if (!transactionType) return null;

    return (
      <div className="space-y-4 animate-fade-in">
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-gray-700">
            {transactionType === 'Saving' ? 'Saving Category' : 
             transactionType === 'Repayment' ? 'Repayment Category' : 'Category'}
          </Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select category..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
              {getCategoryOptions().map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {transactionType === 'Saving' && (
          <div>
            <Label htmlFor="saving-flow" className="text-sm font-medium text-gray-700">Flow</Label>
            <Select value={savingFlow} onValueChange={setSavingFlow}>
              <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Select flow..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                <SelectItem value="cash-in">Cash In</SelectItem>
                <SelectItem value="cash-out">Cash Out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {transactionType === 'Repayment' && (
          <div>
            <Label htmlFor="repayment-party" className="text-sm font-medium text-gray-700">Party Involved</Label>
            <Input
              id="repayment-party"
              type="text"
              placeholder="Enter party name..."
              value={repaymentParty}
              onChange={(e) => setRepaymentParty(e.target.value)}
              className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {(transactionType === 'Expense' || transactionType === 'Income') && (
          <SplitAmountSection
            onAmountYouOweChange={setAmountYouOwe}
            onAmountOwedToYouChange={setAmountOwedToYou}
          />
        )}
      </div>
    );
  };

  const renderPersonalTrackedAmount = () => {
    if (!transactionType || !cashTransaction) return null;

    const personalAmount = calculatePersonalTrackedAmount();

    return (
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 animate-fade-in">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">📌</span>
          <span className="font-semibold text-gray-800">Personal Tracked Amount:</span>
          <span className="font-bold text-blue-600">₫{personalAmount.toFixed(2)}</span>
        </div>
        
        <div className="mt-3 text-sm text-gray-600">
          <p className="font-medium mb-1">What is this?</p>
          <p className="text-xs leading-relaxed">
            This is your Personal Tracked Amount – the part of this transaction that actually affects your budget, 
            excluding shared debts and loans. This number will be recorded in your Actual Budget.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Main Transaction Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Enter Transaction</h1>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="space-y-4">
            <div>
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Saving">Saving</SelectItem>
                  <SelectItem value="Repayment">Repayment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="cash-transaction" className="text-sm font-medium text-gray-700">
                  Cash Transaction
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info size={14} className="text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">This means the total cash movement for the transaction.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₫</span>
                <Input
                  id="cash-transaction"
                  type="number"
                  placeholder="Enter amount..."
                  value={cashTransaction}
                  onChange={(e) => setCashTransaction(e.target.value)}
                  className="pl-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content Based on Type */}
      {renderTypeSpecificFields()}

      {/* Personal Tracked Amount Summary */}
      {renderPersonalTrackedAmount()}

      {/* Save Button */}
      {transactionType && cashTransaction && (
        <div className="pt-4 animate-fade-in flex justify-center">
          <Button 
            onClick={handleSave}
            className="w-full max-w-md bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
          >
            <Save size={16} />
            <span>Save Transaction</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
