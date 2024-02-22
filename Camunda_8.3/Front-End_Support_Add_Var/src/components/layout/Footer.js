import React from 'react';
import { CFooter } from '@coreui/react';
import '../style/footer.css'
const Footer = () => {
  return (
    <CFooter fixed={false} >
      <div className='footer'>© 2024 Tasklist App. All rights reserved.</div>
    </CFooter>
  );
};

export default Footer;
