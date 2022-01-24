import React, { useState } from 'react';
import { Bar, Pie } from "react-chartjs-2";
import './App.css';
import DatePicker from 'react-date-picker';
import Orders from './Utils/data.json'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [formDate, setformDate] = useState(new Date()); 
  const [formDate1, setformDate1] = useState(new Date()); 
  const [formDate2, setformDate2] = useState(new Date());  
  const [data3, setData3] = useState({});
  const [day, setDay] = useState(0);

  const convert = (s) => {
    var d = new Date(s),
    da = ("0" + d.getDate()).slice(-2),
    mn = ("0" + (d.getMonth() + 1)).slice(-2)
    return [d.getFullYear(), mn, da].join("-");
  }

  const date = (convert(formDate));
  
  const orderFiltered = Orders.filter(
    order => order.item_date === date
  )

  const label1 = [];
  const value1 = [];
  const label2 = [];
  const value2 = [];
  const label3 = [];
  const value3 = [];

  const hr = {
    "12am to 3am": 0,
    "3am to 6am": 0,
    "6am to 9am": 0,
    "9am to 12pm": 0,
    "12pm to 3pm": 0,
    "3pm to 6pm": 0,
    "6pm to 9pm": 0,
    "9pm to 12am": 0,
  };
  const dayCount = {
    'Zero' : 0,
    'One' : 0,
    'Two' : 0,
    'Three' : 0,
    'Four' : 0,
    'Five' : 0,
    'Six' : 0,
    'Seven' : 0,
    'Eight' : 0,
    'Nine' : 0,
    'More then 10' : 0,
  }
  function findDays(val) {
    const days = {};
    val.forEach((element) => {
      const dat = element.schedule_time.split(" ");
      if (dat[0] in days) {
        days[dat[0]] += 1;
      } else {
        days[dat[0]] = 1;
      }
    });
    return days;
  }
  const days = findDays(orderFiltered);
  
  const DayOrderFiltered = orderFiltered.filter(
    order =>  order.schedule_time.slice(0,10) === Object.keys(days)[day]
  )
  DayOrderFiltered.forEach((order) => {
    const dat = order.schedule_time.split(" ");
    const time = parseInt(dat[1].slice(0,3));
    const hrs = ((time + 11) % 12) + 1;
    const suff = time >= 12 ? "pm" : "am";

    if (suff === "am" && hrs >= 1 && hrs < 3)       hr["12am to 3am"] += 1;
    else if (suff === "am" && hrs >= 3 && hrs < 6)  hr["3am to 6am"] += 1;
    else if (suff === "am" && hrs >= 9 && hrs < 12) hr["9am to 12pm"] += 1;
    else if (suff === "pm" && hrs >= 9 && hrs < 12) hr["9pm to 12am"] += 1;
    else if (suff === "am" && hrs >= 6 && hrs < 9)  hr["6am to 9am"] += 1;
    else if (suff === "pm" && hrs >= 6 && hrs < 9)  hr["6pm to 9pm"] += 1;
    else if (suff === "pm" && hrs === 12)           hr["12pm to 3pm"] += 1;
    else if (suff === "pm" && hrs === 1)            hr["12pm to 3pm"] += 1;
    else if (suff === "pm" && hrs === 2)            hr["12pm to 3pm"] += 1;
    else if (suff === "pm" && hrs >= 3 && hrs < 6)  hr["3pm to 6pm"] += 1;
    else if (suff === "am" && hrs === 12)           hr["12am to 3am"] += 1;
  }) ; 

  const handleSubmit = (e) => {
    e.preventDefault();

    var da = [];
    if(formDate2>formDate1)
    {
      for(let i=formDate1;i<= formDate2;i = formDate1.getDate()+1){
        da.push(convert(i));
      }
      var temp = [ 0,0,0,0,0,0,0,0,0,0,0];
      for(let i=0;i<da.length;i++){
        const priorDays = Orders.map( (order , idx ) => {
          if(order.item_date == da[i])
          {
            const dat = order.schedule_time.split(" ");
            var da1 = new Date(order.item_date);
            var da2 = new Date(dat[0]);
            var diff = (da1-da2)/86400000;
            temp[diff]+=1;
            if(diff>10)
              temp[10]+=1;
          }
        });
        var cnt=0;
        for (let i in dayCount) {
          label2.push(i);
          dayCount[i] = temp[cnt++];
          value2.push(dayCount[i]);
        }
      }
    }
    setData3({
      labels: label3 ,
      datasets: [
        {
          label: 'Prior days',
          data: value3,
          backgroundColor: 'rgba(238,175,0, 0.4)',
          borderColor: 'rgba(238,175,0, 0.5)',
          pointBorderColor: 'rgba(238,175,0, 0.7)',
          borderWidth: 1,
        },
      ],
    });
  }


  for (let i in days) {
    label1.push(i);
    value1.push(days[i]);
  }
  for (let i in hr) {
    label2.push(i);
    value2.push(hr[i]);
  }
  

  const data = {
    labels: label1,
    datasets: [
      {
        label: "Count",
        data: value1,
        backgroundColor: 'rgba(238,175,0, 0.4)',
        borderColor: 'rgba(238,175,0, 0.5)',
        pointBorderColor: 'rgba(238,175,0, 0.7)',
      },
    ],
  };
  
  const dayData = {
    labels: label2,
    datasets: [
      {
        label: "Count",
        data: value2,
        backgroundColor: 'rgba(238,175,0, 0.4)',
        borderColor: 'rgba(238,175,0, 0.5)',
        pointBorderColor: 'rgba(238,175,0, 0.7)',
      },
    ],
  };


  return (
    <div className="App">
      <div className='form'>
        <h3 className='head1' >Select a Date:</h3>
        <DatePicker
          closeOnScroll={true}
          onChange={ (val) => setformDate(val)}
          selected={formDate}
          dateFormat={"dd-MM-yyyy"}
          className="date"
        />
      </div>
      <div className="chart1">
        <Bar
          className="bar"
          data={data}
          options={{
            onHover: function (e) {
              e.native.target.style.cursor = "pointer";
            },
            onClick: function (c, i) {
              setDay(i[0].index);
            },
            scales: {
              x: { title: { display: true, text: "Date" } },
              y: { title: { display: true, text: "Count" } },
            },
            plugins: {
              title: {
                display: true,
                text: "Day wise schedulling Pattern",
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
        />
      </div>
        <h3 className='head3'>Select a bar/tile in above graph to see the time distribution</h3>
      
      <div className='chart2'>
      <Bar
          className="bar"
          data={dayData}
          options={{
            scales: {
              x: { title: { display: true, text: "Time" } },
              y: { title: { display: true, text: "Count" } },
            },
            plugins: {
              title: {
                display: true,
                text: "Scheduling time distribution Pattern",
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
        />
      </div>
      {/* <div className='form'>
        <h3 className='head1' >From Date:</h3>
        <DatePicker
          closeOnScroll={true}
          onChange={ (val) => convert(setformDate1(val))}
          selected={formDate1}
          dateFormat={"dd-MM-yyyy"}
          className="date1"
        />
        <h3 className='head1' >To Date:</h3>
        <DatePicker
          closeOnScroll={true}
          onChange={ (val) => convert(setformDate2(val))}
          selected={formDate2}
          dateFormat={"dd-MM-yyyy"}
          className="date2"
        />
        <button type="submit" value="Submit" onSubmit={handleSubmit}>
          Submit
        </button>
      </div> */}
      {/* <div className='chart2'> */}
        {/* <Pie data={data3} /> */}
      {/* </div> */}
    </div>
    
  );
}

export default App;
