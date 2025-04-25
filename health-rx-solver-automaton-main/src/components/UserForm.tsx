
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserFormProps {
  name: string;
  setName: (name: string) => void;
  regNo: string;
  setRegNo: (regNo: string) => void;
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
  name,
  setName,
  regNo,
  setRegNo,
  email,
  setEmail,
  onSubmit,
  isLoading
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="regNo">Registration Number</Label>
        <Input
          id="regNo"
          placeholder="REG12347"
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-health-600 hover:bg-health-700" 
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Submit"}
      </Button>
    </form>
  );
};

export default UserForm;
