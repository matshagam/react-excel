import React, { Component } from 'react';
import './App.css';

import { headers, data } from './helpers';

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
        <tbody>
          {data.map(function(row, idx) {
            return (
              <tr key={idx}>
                {row.map(function(cell, idx) {
                  return <td key={idx}>{cell}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
