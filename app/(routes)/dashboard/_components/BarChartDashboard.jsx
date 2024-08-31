import React from 'react'
import { Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';

const transformData = (data) => {
  return data.map(item => ({
    Name: item.name,
    Spent: item.totalSpend,
    Budget: item.amount,
  }));
};



function ActivityChart({budgetList}) {
  const transformedData = transformData(budgetList);
  return (
    <div className='border rounded-lg p-5' style={{ height: 500 }}>
      <h2 className='font-bold text-lg mb-4'>Activity</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={transformedData}
          margin={{ top: 10, right: 20, bottom: 40 }}
        >
          <XAxis dataKey='Name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey='Spent' stackId='a' fill='#4845d2' />
          <Line type='monotone' dataKey='Budget' stroke='#ff7300' />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}


export default ActivityChart;

