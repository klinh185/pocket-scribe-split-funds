
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

  const calculateTotal = (people: Person[]) => {
    return people.reduce((sum, person) => sum + person.amount, 0);
  };

  const updateTotals = (newPeopleYouOwe: Person[], newPeopleWhoOweYou: Person[]) => {
    onAmountYouOweChange(calculateTotal(newPeopleYouOwe));
    onAmountOwedToYouChange(calculateTotal(newPeopleWhoOweYou));
  };

  const handleAddPersonYouOwe = () => {
    if (newPersonNameYouOwe.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newPersonNameYouOwe.trim(),
        amount: 0
      };
      const newList = [...peopleYouOwe, newPerson];
      setPeopleYouOwe(newList);
      setNewPersonNameYouOwe('');
      updateTotals(newList, peopleWhoOweYou);
    }
  };

  const handleAddPersonOwedToYou = () => {
    if (newPersonNameOwedToYou.trim()) {
      const newPerson: Person = {
        id: Date.now().toString(),
        name: newPersonNameOwedToYou.trim(),
        amount: 0
      };
      const newList = [...peopleWhoOweYou, newPerson];
      setPeopleWhoOweYou(newList);
      setNewPersonNameOwedToYou('');
      updateTotals(peopleYouOwe, newList);
    }
  };

  const handleRemovePersonYouOwe = (personId: string) => {
    const newList = peopleYouOwe.filter(person => person.id !== personId);
    setPeopleYouOwe(newList);
    updateTotals(newList, peopleWhoOweYou);
  };

  const handleRemovePersonOwedToYou = (personId: string) => {
    const newList = peopleWhoOweYou.filter(person => person.id !== personId);
    setPeopleWhoOweYou(newList);
    updateTotals(peopleYouOwe, newList);
  };

  const handleAmountChangeYouOwe = (personId: string, amount: number) => {
    const newList = peopleYouOwe.map(person =>
      person.id === personId ? { ...person, amount } : person
    );
    setPeopleYouOwe(newList);
    updateTotals(newList, peopleWhoOweYou);
  };

  const handleAmountChangeOwedToYou = (personId: string, amount: number) => {
    const newList = peopleWhoOweYou.map(person =>
      person.id === personId ? { ...person, amount } : person
    );
    setPeopleWhoOweYou(newList);
    updateTotals(peopleYouOwe, newList);
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
          <Label className="text-sm font-medium text-red-700">Amount You Owe (AP)</Label>
          
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
          <Label className="text-sm font-medium text-green-700">Amount Owed to You (AR)</Label>
          
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
