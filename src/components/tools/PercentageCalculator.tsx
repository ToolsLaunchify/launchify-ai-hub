import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Percent, TrendingUp, Minus } from 'lucide-react';

const PercentageCalculator = () => {
  const [basicCalc, setBasicCalc] = useState({
    number: '',
    percentage: '',
    result: ''
  });

  const [percentChange, setPercentChange] = useState({
    originalValue: '',
    newValue: '',
    result: ''
  });

  const [percentOfTotal, setPercentOfTotal] = useState({
    partValue: '',
    totalValue: '',
    result: ''
  });

  const calculateBasicPercent = () => {
    const num = parseFloat(basicCalc.number);
    const percent = parseFloat(basicCalc.percentage);
    if (!isNaN(num) && !isNaN(percent)) {
      const result = (num * percent) / 100;
      setBasicCalc({ ...basicCalc, result: result.toString() });
    }
  };

  const calculatePercentChange = () => {
    const original = parseFloat(percentChange.originalValue);
    const newVal = parseFloat(percentChange.newValue);
    if (!isNaN(original) && !isNaN(newVal) && original !== 0) {
      const change = ((newVal - original) / original) * 100;
      setPercentChange({ ...percentChange, result: change.toFixed(2) + '%' });
    }
  };

  const calculatePercentOfTotal = () => {
    const part = parseFloat(percentOfTotal.partValue);
    const total = parseFloat(percentOfTotal.totalValue);
    if (!isNaN(part) && !isNaN(total) && total !== 0) {
      const percent = (part / total) * 100;
      setPercentOfTotal({ ...percentOfTotal, result: percent.toFixed(2) + '%' });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Percentage Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate percentages, percentage changes, and more with our comprehensive percentage calculator tool.
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Percent className="w-4 h-4" />
              Basic Percentage
            </TabsTrigger>
            <TabsTrigger value="change" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Percentage Change
            </TabsTrigger>
            <TabsTrigger value="of-total" className="flex items-center gap-2">
              <Minus className="w-4 h-4" />
              Percent of Total
            </TabsTrigger>
          </TabsList>

          {/* Basic Percentage Calculator */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Calculate X% of a Number</CardTitle>
                <CardDescription>
                  Find what percentage of a number equals. For example: What is 25% of 200?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number">Number</Label>
                    <Input
                      id="number"
                      type="number"
                      placeholder="Enter number"
                      value={basicCalc.number}
                      onChange={(e) => setBasicCalc({ ...basicCalc, number: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="percentage">Percentage (%)</Label>
                    <Input
                      id="percentage"
                      type="number"
                      placeholder="Enter percentage"
                      value={basicCalc.percentage}
                      onChange={(e) => setBasicCalc({ ...basicCalc, percentage: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={calculateBasicPercent} className="w-full">
                  Calculate
                </Button>
                {basicCalc.result && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Result:</p>
                    <p className="text-2xl font-bold text-primary">{basicCalc.result}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {basicCalc.percentage}% of {basicCalc.number} is {basicCalc.result}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Percentage Change Calculator */}
          <TabsContent value="change">
            <Card>
              <CardHeader>
                <CardTitle>Percentage Change Calculator</CardTitle>
                <CardDescription>
                  Calculate the percentage increase or decrease between two values.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original">Original Value</Label>
                    <Input
                      id="original"
                      type="number"
                      placeholder="Enter original value"
                      value={percentChange.originalValue}
                      onChange={(e) => setPercentChange({ ...percentChange, originalValue: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new">New Value</Label>
                    <Input
                      id="new"
                      type="number"
                      placeholder="Enter new value"
                      value={percentChange.newValue}
                      onChange={(e) => setPercentChange({ ...percentChange, newValue: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={calculatePercentChange} className="w-full">
                  Calculate Change
                </Button>
                {percentChange.result && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Percentage Change:</p>
                    <p className="text-2xl font-bold text-primary">{percentChange.result}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      From {percentChange.originalValue} to {percentChange.newValue}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Percent of Total Calculator */}
          <TabsContent value="of-total">
            <Card>
              <CardHeader>
                <CardTitle>What Percent is X of Y?</CardTitle>
                <CardDescription>
                  Calculate what percentage one number is of another number.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="part">Part Value</Label>
                    <Input
                      id="part"
                      type="number"
                      placeholder="Enter part value"
                      value={percentOfTotal.partValue}
                      onChange={(e) => setPercentOfTotal({ ...percentOfTotal, partValue: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="total">Total Value</Label>
                    <Input
                      id="total"
                      type="number"
                      placeholder="Enter total value"
                      value={percentOfTotal.totalValue}
                      onChange={(e) => setPercentOfTotal({ ...percentOfTotal, totalValue: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={calculatePercentOfTotal} className="w-full">
                  Calculate Percentage
                </Button>
                {percentOfTotal.result && (
                  <div className="p-4 bg-secondary rounded-lg">
                    <p className="text-sm text-muted-foreground">Result:</p>
                    <p className="text-2xl font-bold text-primary">{percentOfTotal.result}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {percentOfTotal.partValue} is {percentOfTotal.result} of {percentOfTotal.totalValue}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* How to Use Section */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Basic Percentage</h3>
                <p className="text-sm text-muted-foreground">
                  Calculate X% of a number. Useful for discounts, tips, taxes, and more.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Percentage Change</h3>
                <p className="text-sm text-muted-foreground">
                  Find the percentage increase or decrease between two values. Great for analyzing growth rates.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Percent of Total</h3>
                <p className="text-sm text-muted-foreground">
                  Determine what percentage one number represents of another. Perfect for proportions and ratios.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PercentageCalculator;