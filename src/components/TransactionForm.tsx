
import { useState } from 'react';
import { Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserSplitList from './UserSplitList';

const TransactionForm = () => {
  const [transactionType, setTransactionType] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [amountYouOwe, setAmountYouOwe] = useState('');
  const [amountOwedToYou, setAmountOwedToYou] = useState('');
  const [isEqualSplit, setIsEqualSplit] = useState(false);
  const [savingFlow, setSavingFlow] = useState('');
  const [repaymentParty, setRepaymentParty] = useState('');

  const handleSave = () => {
    console.log('Transaction saved:', {
      type: transactionType,
      amount,
      category,
      amountYouOwe,
      amountOwedToYou,
      isEqualSplit,
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
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-3">Split Amount (optional)</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="amount-you-owe" className="text-sm font-medium text-gray-700">Amount You Owe (AP)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                  <Input
                    id="amount-you-owe"
                    type="number"
                    placeholder="0.00"
                    value={amountYouOwe}
                    onChange={(e) => setAmountYouOwe(e.target.value)}
                    className="pl-8 bg-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="amount-owed-to-you" className="text-sm font-medium text-gray-700">Amount Owed to You (AR)</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₫</span>
                  <Input
                    id="amount-owed-to-you"
                    type="number"
                    placeholder="0.00"
                    value={amountOwedToYou}
                    onChange={(e) => setAmountOwedToYou(e.target.value)}
                    className="pl-8 bg-white"
                  />
                </div>
              </div>
            </div>

            <UserSplitList 
              totalAmount={parseFloat(amountOwedToYou) || 0}
              isEqualSplit={isEqualSplit}
              onEqualSplitChange={setIsEqualSplit}
            />
          </div>
        )}
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
              <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₫</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount..."
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Content Based on Type */}
      {renderTypeSpecificFields()}

      {/* Save Button */}
      {transactionType && amount && (
        <div className="pt-4 animate-fade-in">
          <Button 
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
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
