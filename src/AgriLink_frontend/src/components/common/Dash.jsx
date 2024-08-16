import React from 'react';

const Dash = () => {
  return (
    <div className="p-10 bg-background min-h-screen">
      <h2 className="text-3xl font-semibold text-primary mb-5">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Total Investments</h3>
          <p className="text-primary text-2xl">$12,500</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Active Projects</h3>
          <p className="text-primary text-2xl">8</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Land NFTs</h3>
          <p className="text-primary text-2xl">5</p>
        </div>
      </div>
    </div>
  );
};

export default Dash;
