
import { useState } from 'react';
import { ChevronDown, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserSplitList from './UserSplitList';

const TransactionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [transactionType, setTransactionType] = useState('Expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [amountYouOwe, setAmountYouOwe] = useState('');
  const [amountOwedToYou, setAmountOwedToYou] = useState('');
  const [isEqualSplit, setIsEqualSplit] = useState(false);

  const handleNext = () => {
    if (currentStep === 1 && transactionType && amount) {
      setCurrentStep(2);
    }
  };

  const handleSave = () => {
    console.log('Transaction saved:', {
      type: transactionType,
      amount,
      category,
      amountYouOwe,
      amountOwedToYou,
      isEqualSplit
    });
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Transaction Info */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Step 1: Enter Transaction Info</h2>
          <div className="flex space-x-1">
            <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
            <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`} />
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="space-y-4">
            <div>
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">Type</Label>
              <Select value={transactionType} onValueChange={setTransactionType}>
                <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
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

        {currentStep === 1 && (
          <Button 
            onClick={handleNext}
            disabled={!transactionType || !amount}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg"
          >
            Next Step
          </Button>
        )}
      </div>

      {/* Step 2: Add Details */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Step 2: Add Details</h2>
            <Button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Save size={16} />
              <span>Save</span>
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-gray-700">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Salary">Salary</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Split Amounts</h3>
              
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;
