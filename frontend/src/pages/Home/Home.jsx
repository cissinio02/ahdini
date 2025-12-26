import React from 'react';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';

const Home = () => {
  return (
    <div>
      <Header />
      <main style={{ minHeight: '60vh', padding: '40px 20px', textAlign: 'center' }}>
        <h1>Welcome to Ahdini</h1>
        <p>Meow Meow Meow Meow Meow :3</p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
