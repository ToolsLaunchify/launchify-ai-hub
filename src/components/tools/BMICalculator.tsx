import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Scale, Ruler } from 'lucide-react';

const BMICalculator = () => {
  const [metric, setMetric] = useState({
    weight: '',
    height: '',
    result: null as { bmi: number; category: string; color: string } | null
  });

  const [imperial, setImperial] = useState({
    weight: '',
    feet: '',
    inches: '',
    result: null as { bmi: number; category: string; color: string } | null
  });

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'secondary' };
    if (bmi < 25) return { category: 'Normal weight', color: 'default' };
    if (bmi < 30) return { category: 'Overweight', color: 'secondary' };
    return { category: 'Obesity', color: 'destructive' };
  };

  const calculateMetricBMI = () => {
    const weight = parseFloat(metric.weight);
    const height = parseFloat(metric.height);
    
    if (!isNaN(weight) && !isNaN(height) && height > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      const { category, color } = getBMICategory(bmi);
      setMetric({ ...metric, result: { bmi: Number(bmi.toFixed(1)), category, color } });
    }
  };

  const calculateImperialBMI = () => {
    const weight = parseFloat(imperial.weight);
    const feet = parseFloat(imperial.feet);
    const inches = parseFloat(imperial.inches) || 0;
    
    if (!isNaN(weight) && !isNaN(feet) && feet > 0) {
      const totalInches = (feet * 12) + inches;
      const bmi = (weight * 703) / (totalInches * totalInches);
      const { category, color } = getBMICategory(bmi);
      setImperial({ ...imperial, result: { bmi: Number(bmi.toFixed(1)), category, color } });
    }
  };

  const bmiRanges = [
    { range: 'Below 18.5', category: 'Underweight', color: 'bg-blue-100 text-blue-800' },
    { range: '18.5 - 24.9', category: 'Normal weight', color: 'bg-green-100 text-green-800' },
    { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-yellow-100 text-yellow-800' },
    { range: '30.0 and above', category: 'Obesity', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">BMI Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your Body Mass Index (BMI) to assess if you're at a healthy weight for your height.
          </p>
        </div>

        {/* Calculator Tabs */}
        <Tabs defaultValue="metric" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metric" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              Metric (kg/cm)
            </TabsTrigger>
            <TabsTrigger value="imperial" className="flex items-center gap-2">
              <Ruler className="w-4 h-4" />
              Imperial (lbs/ft)
            </TabsTrigger>
          </TabsList>

          {/* Metric Calculator */}
          <TabsContent value="metric">
            <Card>
              <CardHeader>
                <CardTitle>Metric BMI Calculator</CardTitle>
                <CardDescription>
                  Enter your weight in kilograms and height in centimeters.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight-kg">Weight (kg)</Label>
                    <Input
                      id="weight-kg"
                      type="number"
                      placeholder="Enter weight in kg"
                      value={metric.weight}
                      onChange={(e) => setMetric({ ...metric, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height-cm">Height (cm)</Label>
                    <Input
                      id="height-cm"
                      type="number"
                      placeholder="Enter height in cm"
                      value={metric.height}
                      onChange={(e) => setMetric({ ...metric, height: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={calculateMetricBMI} className="w-full">
                  Calculate BMI
                </Button>
                {metric.result && (
                  <div className="p-6 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">Your BMI is</p>
                    <p className="text-4xl font-bold text-primary mb-2">{metric.result.bmi}</p>
                    <Badge variant={metric.result.color as any} className="text-sm">
                      {metric.result.category}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Imperial Calculator */}
          <TabsContent value="imperial">
            <Card>
              <CardHeader>
                <CardTitle>Imperial BMI Calculator</CardTitle>
                <CardDescription>
                  Enter your weight in pounds and height in feet and inches.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="weight-lbs">Weight (lbs)</Label>
                    <Input
                      id="weight-lbs"
                      type="number"
                      placeholder="Enter weight in lbs"
                      value={imperial.weight}
                      onChange={(e) => setImperial({ ...imperial, weight: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height-feet">Height (feet)</Label>
                    <Input
                      id="height-feet"
                      type="number"
                      placeholder="Feet"
                      value={imperial.feet}
                      onChange={(e) => setImperial({ ...imperial, feet: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height-inches">Height (inches)</Label>
                    <Input
                      id="height-inches"
                      type="number"
                      placeholder="Inches"
                      value={imperial.inches}
                      onChange={(e) => setImperial({ ...imperial, inches: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={calculateImperialBMI} className="w-full">
                  Calculate BMI
                </Button>
                {imperial.result && (
                  <div className="p-6 bg-secondary rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-2">Your BMI is</p>
                    <p className="text-4xl font-bold text-primary mb-2">{imperial.result.bmi}</p>
                    <Badge variant={imperial.result.color as any} className="text-sm">
                      {imperial.result.category}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* BMI Categories */}
        <Card>
          <CardHeader>
            <CardTitle>BMI Categories</CardTitle>
            <CardDescription>
              Understanding what your BMI means for your health.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bmiRanges.map((range, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <span className="font-medium">{range.category}</span>
                    <span className="text-sm text-muted-foreground ml-2">BMI {range.range}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${range.color}`}>
                    {range.category}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card>
          <CardHeader>
            <CardTitle>Important Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              BMI is a screening tool and is not intended to diagnose disease or illness. 
              It does not account for muscle mass, bone density, overall body composition, and racial and sex differences. 
              Please consult with a healthcare professional for a comprehensive health assessment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BMICalculator;