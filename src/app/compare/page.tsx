'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

type StockSnapshot = {
  symbol: string
  open: number
  high: number
  low: number
  close: number
}

const companies = ['TSLA', 'RIVN', 'LCID']

export default function ComparePage() {
  const [data, setData] = useState<StockSnapshot[]>([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/compare')
      .then(res => {
        console.log("Compare data:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error('Compare API error:', err);
      });
  }, [])

  const chartData = {
    labels: ['Open', 'High', 'Low', 'Close'],
    datasets: data.map((stock) => ({
      label: stock.symbol,
      data: [stock.open, stock.high, stock.low, stock.close],
      borderColor:
        stock.symbol === 'TSLA'
          ? '#f87171'
          : stock.symbol === 'RIVN'
          ? '#34d399'
          : '#60a5fa',
      tension: 0.3,
      fill: false,
    })),
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: {
        min: 0,
        max: 350, // or dynamically set based on your data
        ticks: {
          callback: (value: number | string) => `$${value}`,
        },
      },
    },
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.slice(0, 2).map((stock) => (
        <Card key={stock.symbol}>
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">
              {stock.symbol} Stock
            </h2>
            <Line
              data={{
                labels: ['Open', 'High', 'Low', 'Close'],
                datasets: [
                  {
                    label: stock.symbol,
                    data: [stock.open, stock.high, stock.low, stock.close],
                    borderColor:
                      stock.symbol === 'TSLA'
                        ? '#f87171'
                        : '#34d399',
                    tension: 0.3,
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                  y: {
                    beginAtZero: false,
                    type: 'linear',
                    position: 'left',
                    ticks: {
                      callback: function (value: number | string) {
                        return `$${value}`;
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      ))}

      {/* LCID Full-Width Card */}
      {data[2] && (
        <Card className="md:col-span-2">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-lg md:text-xl font-semibold">
              {data[2].symbol} Stock
            </h2>
            <Line
              data={{
                labels: ['Open', 'High', 'Low', 'Close'],
                datasets: [
                  {
                    label: data[2].symbol,
                    data: [data[2].open, data[2].high, data[2].low, data[2].close],
                    borderColor: '#60a5fa',
                    tension: 0.3,
                    fill: false,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { display: true } },
                scales: {
                  y: {
                    beginAtZero: false,
                    type: 'linear',
                    position: 'left',
                    ticks: {
                      callback: function (value: number | string) {
                        return `$${value}`;
                      },
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
