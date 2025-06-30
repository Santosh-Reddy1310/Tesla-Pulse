'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
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

export default function ComparePage() {
  const [data, setData] = useState<StockSnapshot[]>([])
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE

  useEffect(() => {
    axios.get(`${BASE_URL}/compare`)
      .then(res => setData(res.data))
      .catch(err => console.error('Compare API error:', err))
  }, [BASE_URL])

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((stock, index) => (
        <Card key={stock.symbol} className={index === 2 ? 'md:col-span-2' : ''}>
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
                        : stock.symbol === 'RIVN'
                        ? '#34d399'
                        : '#60a5fa',
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
                    ticks: {
                      callback: (value: number | string) => `$${value}`,
                    },
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
