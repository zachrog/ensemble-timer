import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/state.ts/defaultState';
import { X, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Goals() {
  const [newGoal, setNewGoal] = useState('');
  const { goals, addGoal, removeGoal, toggleGoalComplete } = useAppStore();

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      addGoal(newGoal.trim());
      setNewGoal('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddGoal();
    }
  };

  return (
    <Card className="bg-zinc-800 text-zinc-200 mb-3 ml-3 w-full">
      <CardHeader>
        <CardTitle className="text-4xl">Session Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Add a goal for this session..."
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-zinc-800 text-2xl h-10 text-white"
          />
          <Button
            onClick={handleAddGoal}
            className="hover:bg-zinc-700"
            disabled={!newGoal.trim()}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="space-y-2">
          {goals.map((goal, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-3 rounded-md border text-2xl ${
                goal.completed
                  ? 'bg-green-950/20 border-green-800 text-green-200'
                  : 'bg-zinc-900/50 border-zinc-700 text-zinc-200'
              }`}
            >
              <Button
                onClick={() => toggleGoalComplete(index)}
                className={`h-8 w-8 p-1 hover:bg-zinc-700 ${
                  goal.completed
                    ? 'text-green-400 hover:text-green-300'
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                <Check className="h-6 w-6" />
              </Button>
              
              <span
                className={`flex-1 ${
                  goal.completed ? 'line-through opacity-75' : ''
                }`}
              >
                {goal.text}
              </span>
              
              <Button
                onClick={() => removeGoal(index)}
                className="h-8 w-8 p-1 hover:bg-zinc-700 text-zinc-500 hover:text-red-400"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          ))}
          
          {goals.length === 0 && (
            <p className="text-zinc-500 text-2xl text-center py-4">
              No goals set for this session. Add one above to get started!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

