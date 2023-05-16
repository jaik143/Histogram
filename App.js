/*step1*/
import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

/*step2*/
const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  /*step3*/
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const text = response.data;
      const words = text.split(/[ \n]+/);
      const wordCount = {};
      for (let i = 0; i < words.length; i++) {
        const word = words[i].toLowerCase().replace(/[^a-z]/g, '');
        if (word) {
          wordCount[word] = (wordCount[word] || 0) + 1;
        }
      }
      const sortedWordCount = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);
      const topWords = sortedWordCount.slice(0, 20);
      setData(topWords);
      setShowSearch(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  /*step4*/
  const handleExport = () => {
    const csv = data.map(([word, count]) => `${word},${count}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'histogram.csv');
  };
  /*step5*/
  const handleSearch = () => {
    const results = data.filter(([word]) => word.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  };



  /*step6*/
  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        Submit
      </button>

      {showSearch && (
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      )}

      {data.length > 0 && (
        <div>
          <button onClick={handleExport}>Export</button>
          <BarChart width={600} height={400} data={searchResults.length ? searchResults : data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="0" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="1" fill="#82ca9d" />
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default App;
