'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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

type StockData = {
  datetime: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

type FormState = {
  open: string
  high: string
  low: string
  volume: string
}

export default function Dashboard() {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [prediction, setPrediction] = useState<number | null>(null)

  const [form, setForm] = useState<FormState>({
    open: '',
    high: '',
    low: '',
    volume: '',
  })

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE

  useEffect(() => {
    axios.get(`${BASE_URL}/stock`)
      .then(res => {
        const data = res.data.data?.[0]
        if (!data) return

        setStockData(data)
        setForm({
          open: data.open.toString(),
          high: data.high.toString(),
          low: data.low.toString(),
          volume: data.volume.toString()
        })
      })
      .catch(err => console.error('Error fetching stock data:', err))
  }, [BASE_URL])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handlePredict = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/predict/tesla`, {
        open: parseFloat(form.open),
        high: parseFloat(form.high),
        low: parseFloat(form.low),
        volume: parseFloat(form.volume)
      })
      setPrediction(res.data.predicted_close)
    } catch (err) {
      console.error('Prediction error:', err)
    }
  }

  const chartData = {
    labels: ['Open', 'High', 'Low', 'Close'],
    datasets: [
      {
        label: 'TSLA Price (Latest)',
        data: stockData ? [stockData.open, stockData.high, stockData.low, stockData.close] : [],
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => `$${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: '#e5e7eb' },
        ticks: { color: '#4B5563', font: { size: 13 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#4B5563', font: { size: 13 } },
      },
    },
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Tesla Stock Overview</h2>
          {stockData && (
            <ul className="space-y-1 text-sm">
              <li><strong>Date:</strong> {stockData.datetime}</li>
              <li><strong>Open:</strong> ${stockData.open}</li>
              <li><strong>High:</strong> ${stockData.high}</li>
              <li><strong>Low:</strong> ${stockData.low}</li>
              <li><strong>Close:</strong> ${stockData.close}</li>
              <li><strong>Volume:</strong> {stockData.volume?.toLocaleString()}</li>
            </ul>
          )}
          <h3 className="text-sm font-medium text-muted-foreground">📊 Price Trend</h3>
          <div className="w-full mt-4 h-[250px]">
            {stockData ? (
              <Line data={chartData} options={chartOptions as any} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No data</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Predict Next Day Close</h2>
          <div className="grid grid-cols-2 gap-3">
            {['open', 'high', 'low', 'volume'].map((field) => (
              <div key={field}>
                <Label className="capitalize">{field}</Label>
                <Input
                  type="number"
                  name={field}
                  value={form[field as keyof FormState]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <Button onClick={handlePredict}>Predict</Button>
          {prediction !== null && (
            <p className="text-green-600 text-lg font-semibold">
              Predicted Close: ${prediction}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
