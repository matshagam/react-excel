import React from 'react';

export const Button = ({ search, _toggleSearch, _download }) => {
  return (
    <div>
      <button className={search ? 'active' : null} onClick={_toggleSearch}>
        Search
      </button>
      <button>
        <a onClick={_download.bind(this, 'json')} href="data.json">
          Export JSON
        </a>
      </button>
      <button>
        <a onClick={_download.bind(this, 'csv')} href="data.csv">
          Export CSV
        </a>
      </button>
    </div>
  );
};
