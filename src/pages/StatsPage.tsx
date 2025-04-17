
import React, { PureComponent } from "react";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StatsPage: React.FC = () => {
  // Activity by category data
  const categoryData = [
    { name: 'Fitness', value: 32 },
    { name: 'Learning', value: 45 },
    { name: 'Mindfulness', value: 28 },
    { name: 'Productivity', value: 38 },
    { name: 'Creativity', value: 20 },
    { name: 'Social', value: 15 },
  ];
  
  // Weekly completion data
  const weeklyData = [
    { day: 'Mon', tasks: 5, points: 120 },
    { day: 'Tue', tasks: 4, points: 100 },
    { day: 'Wed', tasks: 6, points: 150 },
    { day: 'Thu', tasks: 3, points: 80 },
    { day: 'Fri', tasks: 5, points: 130 },
    { day: 'Sat', tasks: 7, points: 180 },
    { day: 'Sun', tasks: 5, points: 140 },
  ];
  
  // Monthly progress data
  const monthlyData = [
    { month: 'Jan', points: 1200 },
    { month: 'Feb', points: 1800 },
    { month: 'Mar', points: 2400 },
    { month: 'Apr', points: 2800 },
  ];
  
  // Monochrome colors
  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#BBBBBB', '#DDDDDD'];
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold mb-2">Your Statistics</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-mono-light shadow-sm">
            <CardHeader className="border-b border-mono-light">
              <CardTitle className="text-xl font-bold">Activity by Category</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip 
                    formatter={(value, name) => [`${value} tasks`, name]}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-mono-light shadow-sm">
            <CardHeader className="border-b border-mono-light">
              <CardTitle className="text-xl font-bold">Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="tasks" name="Tasks Completed" fill="#000000" />
                  <Bar dataKey="points" name="Points Earned" fill="#666666" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="border-mono-light shadow-sm lg:col-span-2">
            <CardHeader className="border-b border-mono-light">
              <CardTitle className="text-xl font-bold">Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="points" 
                    name="Total Points" 
                    stroke="#000000" 
                    strokeWidth={2}
                    dot={{ stroke: '#000000', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StatsPage;
