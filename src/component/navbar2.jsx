import React from 'react';

export default function Navbar(){
return (
    <nav style={styles.nav}>
      <div style={styles.brand}>My Todo</div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: '12px 16px',
    borderBottom: '1px solid #e55b5bff',
    background: '#f4b3b3ff',
    marginTop: 0,
  },
  brand: {
    fontWeight: 700,
    fontSize: 18,
  },

}