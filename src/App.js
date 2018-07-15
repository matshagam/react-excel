import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { headers } from './helpers';

export default class Excel extends Component {
  render() {
    return (
      <table>
        <thead>
          <tr>
            {headers.map(function(title, idx) {
              return <th key={idx}>{title}</th>;
            })}
          </tr>
        </thead>
      </table>
    );
  }
}
