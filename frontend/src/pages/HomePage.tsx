// import { useNavigate, useParams } from 'react-router-dom';
// import { useState } from 'react';
import WelcomeBand from '../components/WelcomeBand';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';

function HomePage() {
  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <WelcomeBand />
    </AuthorizeView>
  );
}

export default HomePage;
