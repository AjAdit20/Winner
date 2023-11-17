import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import Header from './components/Header';
import Alert from 'react-bootstrap/Alert';

function App() {
  const [prizes, setPrizes] = useState([]);
  const [filteredPrizes, setFilteredPrizes] = useState([]);
  const [multipleWinners, setMultipleWinners] = useState([]);
  const [year, setYear] = useState('');
  const [category, setCategory] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const manualCategories = ['Physics', 'Chemistry', 'Peace','	Economics','Literature','Medicine'];

  const fetchPrizes = async () => {
    try {
      const response = await fetch('https://api.nobelprize.org/v1/prize.json');
      const data = await response.json();
  
      // Check if the data contains 'prizes' property
      const receivedPrizes = data.prizes || [];
      setPrizes(receivedPrizes);
      setFilteredPrizes(receivedPrizes);
      const winners = getMultipleWinners(receivedPrizes);
      setMultipleWinners(winners);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPrizes();// eslint-disable-next-line
  }, []); // Empty dependency array since there are no dependencies

  useEffect(() => {
    if (showAlert) {
      const timeoutId = setTimeout(() => {
        setShowAlert(false);
      }, 1000); 
      return () => clearTimeout(timeoutId);
    }
  }, [showAlert]);

  const filterPrizes = () => {
    const filtered = prizes.filter((prize) => {
      const isYearMatch = !year || Number(prize.year) === year;
      const isCategoryMatch = !category || String(prize.category).toLowerCase() === category.toLowerCase();;
  
      return isYearMatch && isCategoryMatch;
    });
    setFilteredPrizes(filtered);
    setShowAlert(true);
  };
  
  
  const getMultipleWinners = (prizes) => {
    const winnerCounts = {};
    if (prizes && Array.isArray(prizes)) {
      prizes.forEach((prize) => {
        if (prize.laureates && Array.isArray(prize.laureates)) {
          prize.laureates.forEach((laureate) => {
            winnerCounts[laureate.id] = (winnerCounts[laureate.id] || 0) + 1;
          });
        }
      });
    }

    return prizes
      ? prizes
          .flatMap((prize) => prize.laureates || [])
          .filter((laureate) => winnerCounts[laureate.id] > 1)
      : [];
  };
  

  return (
    <>
    <Header/>
    <div className='drop'>
      <p>Sort By:</p>
        <Dropdown className='drop1'>
          <Dropdown.Toggle variant="success" id="dropdown-year">
          {year ? year : 'Select Year'}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {[...Array(2019 - 1900).keys()].map((index) => {
              const yearValue = 1900 + index;
              return (
                <Dropdown.Item key={yearValue} onClick={() => setYear(yearValue)}>
                  {yearValue}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className='drop2'>
  <Dropdown.Toggle variant="success" id="dropdown-category">
    {category ? category : 'Select Category'}
  </Dropdown.Toggle>
  <Dropdown.Menu>
    {manualCategories.map((cat) => (
      <Dropdown.Item key={cat} onClick={() => setCategory(cat)}>
        {cat}
      </Dropdown.Item>
    ))}
  </Dropdown.Menu>
</Dropdown>

        <button onClick={filterPrizes} className='filter'>Filter</button>
      </div>
      <Alert show={showAlert} variant="success" onClose={() => setShowAlert(false)} dismissible>
      Filter applied successfully!
    </Alert>
      <div>
      <h2 style={{textAlign:'center',backgroundColor:'Blue', color:'white'}}>Multiple Winners</h2>
  <table className="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Surname</th>
      </tr>
    </thead>
    <tbody>
      {multipleWinners && multipleWinners.map((winner) => (
        <tr key={winner.id}>
          <td>{winner.id}</td>
          <td>{winner.firstname}</td>
          <td>{winner.surname}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
<div>
  <h2 style={{textAlign:'center', backgroundColor:'red', color:'white'}}>Prize Winners</h2>
   <table className="table">
    <thead>
      <tr>
        <th>Year</th>
        <th>Category</th>
        <th>First Name</th>
        <th>Surname</th>
      </tr>
    </thead>
    <tbody>
      {filteredPrizes && filteredPrizes.map((prize) => (
        prize.laureates && prize.laureates.map((laureate) => (
          <tr key={laureate.id}>
            <td>{prize.year}</td>
            <td>{prize.category}</td>
            <td>{laureate.firstname}</td>
            <td>{laureate.surname}</td>
          </tr>
        ))
      ))}
    </tbody>
  </table>
      </div>
    </>
  );
}

export default App;

