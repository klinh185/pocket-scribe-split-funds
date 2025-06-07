
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plus, X } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  amount: number;
}

interface SplitAmountSectionProps {
  onAmountYouOweChange: (total: number) => void;
  onAmountOwedToYouChange: (total: number) => void;
}

const SplitAmountSection = ({ onAmountYouOweChange, onAmountOwedToYouChange }: SplitAmountSectionProps) => {
  const [peopleYouOwe, setPeopleYouOwe] = useState<Person[]>([]);
  const [peopleWhoOweYou, setPeopleWhoOweYou] = useState<Person[]>([]);
  const [newPersonNameYouOwe, setNewPersonNameYouOwe] = useState('');
  const [newPersonNameOwedToYou, setNewPersonNameOwedToYou] = useState('');
  const [amountYouOweTotal, setAmountYouOweTotal] = useState(0);
  const [amountOwedToYouTotal, setAmountOwedToYouTotal] = useState(0);
  const [equallyYouOwe, setEquallyYouOwe] = useState<string>('');
  const [equallyOwedToYou, setEquallyOwedToYou] = useState<string>('');

  const calculateTotal = (people: Person[]) => {
    return people.reduce((sum, person) => sum + person.amount, 0);
  };

  const updateTotals = (newPeopleYouOwe: Person[], newPeopleWhoOweYou: Person[]) => {
    const youOweTotal = calculateTotal(newPeopleYouOwe);
    const owedToYouTotal = calculateTotal(newPeopleWhoOweYou);
    
    setAmountYouOweTotal(youOweTotal);
    setAmountOwedToYouTotal(owedToYouTotal);
    
    onAmountYouOweChange(youOweTotal);
    onAmountOwedToYouChange(owedToYouTotal);
  };

  const distributeEqually = (totalAmount: number, people: Person[], isYouOwe: boolean) => {
    if (people.length === 0) return people;
    
    const amountPerPerson = totalAmount / people.length;
    const updatedPeople = people.map(person => ({
      ...person,
      amount: amountPerPerson
    }));

    if (isYouOwe) {
      setPeopleYouOwe(updatedPeople);
      updateTotals(updatedPeople, peopleWhoOweYou);
    } else {
      setPeopleWhoOweYou(updatedPeople);
      updateTotals(peopleYouOwe, updatedPeople);
    }

    return updatedPeople;
  };

  const handleEquallyToggleYouOwe = (value: string) => {
    setEquallyYouOwe(value);
    if (value === 'equally') {
      distributeEqually(amountYouOweTotal, peopleYouOwe, true);
    }
  };

  const handleEquallyToggleOwedToYou = (value: string) => {
    setEquallyOwedToYou(value);
    if (value === 'equally') {
      distributeEqually(amountOwedToYouTotal, peopleWhoOweYou, false);
    }
  };

  const handleAmountYouOweTotalChange = (amount: number) => {
    setAmountYouOweTotal(amount);
    if (equallyYouOwe === 'equally') {
      distributeEqually(amount, peopleYouOwe, true);
    }
  };

  const handleAmountOwedToYouTotalChange = (amount: number) => {
    setAmountOwedToYouTotal(amount);
    if (equallyOwedToYou === 'equally') {
      distributeEqually(amount, peopleWhoOweYou, false);
    }
  };

  const handleAddPersonYouOwe = () => {
    if (newPersonNameYouOwe.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newPersonNameYouOwe.trim(),
        amount: equallyYouOwe === 'equally' ? amountYouOweTotal / (peopleYouOwe.length + 1) : 0
      };
      const newList = [...peopleYouOwe, newPerson];
      setPeopleYouOwe(newList);
      setNewPersonNameYouOwe('');
      
      if (equallyYouOwe === 'equally') {
        distributeEqually(amountYouOweTotal, newList, true);
      } else {
        updateTotals(newList, peopleWhoOweYou);
      }
    }
  };

  const handleAddPersonOwedToYou = () => {
    if (newPersonNameOwedToYou.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newPersonNameOwedToYou.trim(),
        amount: equallyOwedToYou === 'equally' ? amountOwedToYouTotal / (peopleWhoOweYou.length + 1) : 0
      };
      const newList = [...peopleWhoOweYou, newPerson];
      setPeopleWhoOweYou(newList);
      setNewPersonNameOwedToYou('');
      
      if (equallyOwedToYou === 'equally') {
        distributeEqually(amountOwedToYouTotal, newList, false);
      } else {
        updateTotals(peopleYouOwe, newList);
      }
    }
  };

  const handleRemovePersonYouOwe = (personId: string) => {
    const newList = peopleYouOwe.filter(person => person.id !== personId);
    setPeopleYouOwe(newList);
    
    if (equallyYouOwe === 'equally' && newList.length > 0) {
      distributeEqually(amountYouOweTotal, newList, true);
    } else {
      updateTotals(newList, peopleWhoOweYou);
    }
  };

  const handleRemovePersonOwedToYou = (personId: string) => {
    const newList = peopleWhoOweYou.filter(person => person.id !== personId);
    setPeopleWhoOweYou(newList);
    
    if (equallyOwedToYou === 'equally' && newList.length > 0) {
      distributeEqually(amountOwedToYouTotal, newList, false);
    } else {
      updateTotals(peopleYouOwe, newList);
    }
  };

  const handleAmountChangeYouOwe = (personId: string, amount: number) => {
    const newList = peopleYouOwe.map(person =>
      person.id === personId ? { ...person, amount } : person
    );
    setPeopleYouOwe(newList);
    updateTotals(newList, peopleWhoOweYou);
    // Reset equally toggle when manual changes are made
    setEquallyYouOwe('');
  };

  const handleAmountChangeOwedToYou = (personId: string, amount: number) => {
    const newList = peopleWhoOweYou.map(person =>
      person.id === personId ? { ...person, amount } : person
    );
    setPeopleWhoOweYou(newList);
    updateTotals(peopleYouOwe, newList);
    // Reset equally toggle when manual changes are made
    setEquallyOwedToYou('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-800 mb-4">Split Amount (optional)</h3>
      
      <div className="space-y-6">
        {/* Amount You Owe Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-red-700">Amount You Owe (AP)</Label>
            <ToggleGroup type="single" value={equallyYouOwe} onValueChange={handleEquallyToggleYouOwe}>
              <ToggleGroupItem value="equally" className="text-xs px-3 py-1">
                Equally
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₫</span>
            <Input
              type="number"
              value={amountYouOweTotal.toFixed(2)}
              onChange={(e) => handleAmountYouOweTotalChange(parseFloat(e.target.value) || 0)}
              className="pl-6 bg-white border-red-300 focus:border-red-500 focus:ring-red-500"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          {peopleYouOwe.map((person) => (
            <div key={person.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-red-200">
              <Avatar className={`w-8 h-8 ${getAvatarColor(person.name)}`}>
                <AvatarFallback className="text-white text-xs font-medium">
                  {getInitials(person.name)}
                </AvatarFallback>
              </Avatar>
              
              <span className="flex-1 text-sm font-medium text-gray-700">{person.name}</span>
              
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₫</span>
                <Input
                  type="number"
                  value={person.amount.toFixed(2)}
                  onChange={(e) => handleAmountChangeYouOwe(person.id, parseFloat(e.target.value) || 0)}
                  className="pl-6 text-xs h-8 bg-gray-50 border-gray-300"
                  step="0.01"
                  disabled={equallyYouOwe === 'equally'}
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePersonYouOwe(person.id)}
                className="w-6 h-6 p-0 text-gray-400 hover:text-red-500"
              >
                <X size={12} />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-red-200">
            <Input
              type="text"
              placeholder="Add person you owe..."
              value={newPersonNameYouOwe}
              onChange={(e) => setNewPersonNameYouOwe(e.target.value)}
              className="flex-1 text-sm h-8 bg-white border-gray-300"
              onKeyPress={(e) => e.key === 'Enter' && handleAddPersonYouOwe()}
            />
            <Button
              onClick={handleAddPersonYouOwe}
              disabled={!newPersonNameYouOwe.trim()}
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 h-8"
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>

        {/* Amount Owed to You Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-green-700">Amount Owed to You (AR)</Label>
            <ToggleGroup type="single" value={equallyOwedToYou} onValueChange={handleEquallyToggleOwedToYou}>
              <ToggleGroupItem value="equally" className="text-xs px-3 py-1">
                Equally
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <div className="relative">
            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₫</span>
            <Input
              type="number"
              value={amountOwedToYouTotal.toFixed(2)}
              onChange={(e) => handleAmountOwedToYouTotalChange(parseFloat(e.target.value) || 0)}
              className="pl-6 bg-white border-green-300 focus:border-green-500 focus:ring-green-500"
              step="0.01"
              placeholder="0.00"
            />
          </div>
          
          {peopleWhoOweYou.map((person) => (
            <div key={person.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-green-200">
              <Avatar className={`w-8 h-8 ${getAvatarColor(person.name)}`}>
                <AvatarFallback className="text-white text-xs font-medium">
                  {getInitials(person.name)}
                </AvatarFallback>
              </Avatar>
              
              <span className="flex-1 text-sm font-medium text-gray-700">{person.name}</span>
              
              <div className="relative w-24">
                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₫</span>
                <Input
                  type="number"
                  value={person.amount.toFixed(2)}
                  onChange={(e) => handleAmountChangeOwedToYou(person.id, parseFloat(e.target.value) || 0)}
                  className="pl-6 text-xs h-8 bg-gray-50 border-gray-300"
                  step="0.01"
                  disabled={equallyOwedToYou === 'equally'}
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePersonOwedToYou(person.id)}
                className="w-6 h-6 p-0 text-gray-400 hover:text-green-500"
              >
                <X size={12} />
              </Button>
            </div>
          ))}
          
          <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-green-200">
            <Input
              type="text"
              placeholder="Add person who owes you..."
              value={newPersonNameOwedToYou}
              onChange={(e) => setNewPersonNameOwedToYou(e.target.value)}
              className="flex-1 text-sm h-8 bg-white border-gray-300"
              onKeyPress={(e) => e.key === 'Enter' && handleAddPersonOwedToYou()}
            />
            <Button
              onClick={handleAddPersonOwedToYou}
              disabled={!newPersonNameOwedToYou.trim()}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 h-8"
            >
              <Plus size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitAmountSection;
