import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import Footer from './Footer';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const footer = ReactDOM.createRoot(document.getElementById('footer'));
footer.render(
  <React.StrictMode>
    <Footer />
  </React.StrictMode>
);

function setBackgroundFromTime() {
  const now = new Date();
  const hour = now.getHours();
  const body = document.body;

  body.classList.remove('sunrise', 'morning', 'afternoon', 'sunset', 'evening', 'night');

  // Map hours to class names
  // const hourClassMap = [
  //   'night','night','night','night','night','night','night', // 0-6
  //   'sunrise',                                                // 7
  //   'morning','morning','morning','morning','morning',       // 8-12
  //   'afternoon','afternoon','afternoon','afternoon','afternoon','afternoon', // 13-18
  //   'sunset',                                                // 19
  //   'evening','evening','evening','evening'                  // 20-23
  // ];

  const timeRanges = [
    { range: [0, 6], className: 'night' }, // 1-6am
    { range: [7, 7], className: 'sunrise' }, // 7am
    { range: [8, 12], className: 'morning' }, // 8am-12pm
    { range: [13, 18], className: 'afternoon' }, // 1-6pm
    { range: [19, 19], className: 'sunset' }, // 7pm
    { range: [20, 23], className: 'evening' } // 8pm-12am
  ]

  const current = timeRanges.find(t => hour >= t.range[0] && hour <= t.range[1]);
  const currentClass = current ? current.className : 'night'; // default to 'night' if not found
  // const currentClass = hourClassMap[hour];
  body.className = currentClass; // apply class for text/colors/etc.
  const bgImg = `url('/images/bg-${currentClass}.jpg')`;
  
  body.style.backgroundImage = bgImg;
  body.style.backgroundSize = 'cover';
  body.style.backgroundRepeat = 'no-repeat';

  console.log('Current hour:', hour, 'Class:', currentClass, 'Background:', bgImg);
}

setBackgroundFromTime();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
