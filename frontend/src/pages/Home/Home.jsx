import React from 'react';
import styles from './Home.module.css';
import Header from '../../components/layouts/Header/Header';
import Footer from '../../components/layouts/Footer/Footer';
import {giftHero} from '../../assets/images/images';
import ParticlesComponent from '../../components/UI/Particles';
import Button from '../../components/UI/button';
import {gift,date,heart} from '../../assets/icons/icons'



export default function  Home  () {

  return (
    <div>
     
      <Header />
      
      
      <main style={{ minHeight: '60vh', textAlign: 'center' }}>
      
 <section className={styles.heroSection}>
         <div className={styles.heroTxt}>
            <p className={styles.heroSubtitle}>PREMIUM SURPRISE DELIVERY</p>
           <h1 className={styles.heroTitle}>Make every occasion
<span className={styles.unforgettable}> unforgettable </span>with Ahdini.</h1>
<p className= {styles.heroDesc}>Schedule luxurious gifts and surprises for your loved ones with precision and elegance. We handle the wrapping, the timing, and the memory.</p>
          <div className={styles.btn}>
 <Button className={styles.gift} variant="primary" >
                                  { 'Chose a Gift'}
                              </Button>
                               <Button className={styles.schedule} variant="secondary" >
                                  { 'Schedule a Surprise'}
                              </Button>
            </div>  
          </div>
         
             <div className={styles.heroImg}>
        <div className="hero-image-wrapper relative w-[500px] h-[500px]"> 
    <ParticlesComponent />
    <img src={giftHero} className="relative z-10 w-full h-full object-cover pointer-events-none" />
</div>
        
            </div>  

        </section>

        <section className={styles.processSection}>
<div className={styles.processHeader}>

<p className={styles.processP}>THE PROCESS</p>
 <h1 className={styles.processT}>Simple, yet meaningful</h1>      
<div className={styles.processD}>
<div className={styles.pros}>

  <img src={gift} alt="" />
  <h3>1. Choose a Gift</h3>
  <p>Select from our curated collection of premium items.</p>
</div>

<div className={styles.pros}>


  <img src={date} alt="" />
  <h3>2. Schedule Surprise</h3>
  <p>Pick the perfect date and time for the delivery.</p>
</div>

<div className={styles.pros}>


  <img src={heart} alt="" />
  <h3>3. We Deliver</h3>
  <p>We ensure a memorable experience for your loved one.</p>
</div>

</div>

</div>

        </section>
    
       
      </main>
      <Footer />
    </div>
  );
}

