
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  amount: number;
}

interface UserSplitListProps {
  totalAmount: number;
  isEqualSplit: boolean;
  onEqualSplitChange: (value: boolean) => void;
}

const UserSplitList = ({ totalAmount, isEqualSplit, onEqualSplitChange }: UserSplitListProps) => {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Kali', amount: 0 },
    { id: '2', name: 'HMinh', amount: 0 }
  ]);
  const [newPersonName, setNewPersonName] = useState('');

  useEffect(() => {
    if (isEqualSplit && users.length > 0) {
      const splitAmount = totalAmount / users.length;
      setUsers(prevUsers => 
        prevUsers.map(user => ({ ...user, amount: splitAmount }))
      );
    }
  }, [isEqualSplit, totalAmount, users.length]);

  const handleUserAmountChange = (userId: string, amount: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, amount } : user
      )
    );
  };

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      const newUser: User = {
        id: Date.now().toString(),
        name: newPersonName.trim(),
        amount: isEqualSplit ? totalAmount / (users.length + 1) : 0
      };
      setUsers(prevUsers => [...prevUsers, newUser]);
      setNewPersonName('');
      
      // Recalculate equal split if enabled
      if (isEqualSplit) {
        const splitAmount = totalAmount / (users.length + 1);
        setUsers(prevUsers => 
          prevUsers.map(user => ({ ...user, amount: splitAmount }))
        );
      }
    }
  };

  const handleRemovePerson = (userId: string) => {
    if (users.length > 1) {
      setUsers(prevUsers => {
        const filteredUsers = prevUsers.filter(user => user.id !== userId);
        
        // Recalculate equal split if enabled
        if (isEqualSplit && filteredUsers.length > 0) {
          const splitAmount = totalAmount / filteredUsers.length;
          return filteredUsers.map(user => ({ ...user, amount: splitAmount }));
        }
        
        return filteredUsers;
      });
    }
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
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Who owes the amount:</h4>
        <Button
          variant={isEqualSplit ? "default" : "outline"}
          size="sm"
          onClick={() => onEqualSplitChange(!isEqualSplit)}
          className={isEqualSplit ? "bg-blue-600 text-white" : "border-gray-300"}
        >
          Equally
        </Button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-3 p-2 bg-white rounded-lg border border-gray-200">
            <Avatar className={`w-8 h-8 ${getAvatarColor(user.name)}`}>
              <AvatarFallback className="text-white text-xs font-medium">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            
            <span className="flex-1 text-sm font-medium text-gray-700">{user.name}</span>
            
            <div className="relative w-24">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₫</span>
              <Input
                type="number"
                value={user.amount.toFixed(2)}
                onChange={(e) => handleUserAmountChange(user.id, parseFloat(e.target.value) || 0)}
                disabled={isEqualSplit}
                className="pl-6 text-xs h-8 bg-gray-50 border-gray-300"
                step="0.01"
              />
            </div>
            
            {users.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePerson(user.id)}
                className="w-6 h-6 p-0 text-gray-400 hover:text-red-500"
              >
                <X size={12} />
              </Button>
            )}
          </div>
        ))}
        
        {/* Add Person Input */}
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
          <Input
            type="text"
            placeholder="Add person..."
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            className="flex-1 text-sm h-8 bg-white border-gray-300"
            onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
          />
          <Button
            onClick={handleAddPerson}
            disabled={!newPersonName.trim()}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 h-8"
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSplitList;
