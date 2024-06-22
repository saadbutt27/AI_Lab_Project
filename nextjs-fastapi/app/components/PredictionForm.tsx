"use client"

import { useState } from 'react';

const PredictionForm = () => {
    const [formData, setFormData] = useState({
        high_price: '',
        low_price: '',
        adj_close: '',
        volume: '',
        tweet: ''
    });
    const [resultData, setResultData] = useState({
        open_price: '',
        close_price: ''
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          high_price: formData.high_price,
          low_price: formData.low_price,
          adj_close: formData.adj_close,
          volume: formData.volume,
          tweet: formData.tweet
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log(data)
      setResultData({
        open_price: data.open_price.toString(),
        close_price: data.close_price.toString()
      });    
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      high_price: '',
      low_price: '',
      adj_close: '',
      volume: '',
      tweet: ''
    });
    setResultData({
      open_price: '',
      close_price: ''
    });
  };  

  return (
    <>
        <div className="flex justify-between">
          <h2 className='text-2xl font-semibold'>
            Stock Price Prediction
          </h2>
            <button onClick={handleClear} className="bg-blue-500 text-white py-2 px-4 rounded mr-4 hover:scale-105 hover:duration-300">Clear Form</button>
        </div>
        <form onSubmit={handleSubmit} className="max-w-md mt-8">
        <div className="grid grid-cols-2 gap-4">
            <label>High Price</label>
            <input type="text" name="high_price" value={formData.high_price} onChange={handleChange} className="border p-2" />

            <label>Low Price</label>
            <input type="text" name="low_price" value={formData.low_price} onChange={handleChange} className="border p-2" />

            <label>Adj Close</label>
            <input type="text" name="adj_close" value={formData.adj_close} onChange={handleChange} className="border p-2" />

            <label>Volume</label>
            <input type="text" name="volume" value={formData.volume} onChange={handleChange} className="border p-2" />

            <label>Tweet</label>
            {/* <input type="text" name="sentiment" value={formData.tweet} onChange={handleChange} className="border p-2" /> */}
            <textarea name="tweet" value={formData.tweet} onChange={handleChange} className="border p-2 h-20 resize-none"></textarea>
            
            <button type="submit" className="col-span-2 bg-blue-500 text-white p-2 rounded hover:scale-105 hover:duration-300">Predict</button>
        </div>
        </form>
        {resultData.open_price && resultData.close_price && (
         <div className="flex justify-center items-center max-w-md mx-auto mt-8 transition-opacity duration-500 ease-in-out opacity-100">
            <p className="text-lg"><b className="text-2xl">Open Price:</b> {resultData.open_price}</p>
            <p className="text-lg"><b className="text-2xl">Close Price:</b> {resultData.close_price}</p>
        </div>
      )}
    </>
  );
};

export default PredictionForm;
