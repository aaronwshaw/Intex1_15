// import { useNavigate, useParams } from 'react-router-dom';
// import { useState } from 'react';
//import WelcomeBand from '../components/WelcomeBand';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import CategorySlider from '../components/CategorySlider/CategorySlider';
import Products from '../components/Products/Products';
import MainSlider from '../components/MainSlider/MainSlider';
import WelcomeBand from '../components/WelcomeBand';

export default function HomePage() {
  return (
    <AuthorizeView>
      <>
        {/* Top bar with logout and email */}
        <div style={{ textAlign: 'right', margin: '1rem' }}>
          <Logout>
            Logout <AuthorizedUser value="email" />
          </Logout>
        </div>

        {/* Main content layout */}
        <WelcomeBand />
        <MainSlider />
        {/* /*<CategorySlider /> */}
        <Products />
      </>
    </AuthorizeView>
  );
}
