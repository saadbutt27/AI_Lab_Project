"use client"

import { useState } from 'react';
import clsx from 'clsx';

const ClassificationForm = () => {
  const [formData, setFormData] = useState({
    open_price: '',
    close_price: '',
    high_price: '',
    low_price: '',
    adj_close: '',
    volume: '',
    tweet: ''
  });
  const [resultData, setResultData] = useState({
    recommendation: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data)
      setResultData({
        recommendation: data.recommendation
      });    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      open_price: '',
      high_price: '',
      low_price: '',
      close_price: '',
      adj_close: '',
      volume: '',
      tweet: ''
    });
    setResultData({
      recommendation: ''
    });
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h2 className='text-2xl font-semibold'>
          <span className='text-green-500'>Bullish</span> 
          {" "} / {" "} 
          <span className='text-red-500'>Bearish</span>
        </h2>
        <button onClick={handleClear} className="bg-blue-500 text-white py-2 px-4 rounded hover:scale-105 hover:duration-300">Clear Form</button>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Open Price</label>
            <input type="text" name="open_price" value={formData.open_price} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label>Close Price</label>
            <input type="text" name="close_price" value={formData.close_price} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label>High Price</label>
            <input type="text" name="high_price" value={formData.high_price} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label>Low Price</label>
            <input type="text" name="low_price" value={formData.low_price} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label>Adj Close</label>
            <input type="text" name="adj_close" value={formData.adj_close} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label>Volume</label>
            <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="border p-2 w-full" />
          </div>
          <div>
            <label>Avg Sentiment</label>
            {/* <input type="text" name="sentiment" value={formData.tweet} onChange={handleChange} className="border p-2 w-full" /> */}
            <textarea name="tweet" value={formData.tweet} onChange={handleChange} className="border p-2 h-20 resize-none"></textarea>
          </div>
          <button type="submit" className="col-span-1 md:col-span-2 bg-blue-500 text-white p-2 rounded hover:scale-105 hover:duration-300">Predict</button>
        </div>
      </form>
      {resultData.recommendation && (
        <div className="flex justify-center items-center max-w-md mx-auto mt-8 transition-opacity duration-500 ease-in-out opacity-100">
          <p className="text-2xl">Recommendation: <em className={clsx('font-semibold', {
            'text-green-500': resultData.recommendation === 'Buy',
            'text-red-500': resultData.recommendation === 'Sell'
          })}>{resultData.recommendation}</em>
          </p>
        </div>
      )}
    </>
  );
};

export default ClassificationForm;
