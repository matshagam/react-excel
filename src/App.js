import React, { Component } from 'react';
import './App.css';

import { constHeaders, constData } from './helpers';

export default class Excel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: constData,
      descending: false,
      sortby: null
    };
  }

  _sort = e => {
    var column = e.target.cellIndex;
    var data = Array.from(this.state.data);
    var descending = this.state.sortby === column && !this.state.descending;
    data.sort((a, b) => {
      return descending ? a[column] < b[column] : a[column] > b[column];
    });
    this.setState({
      data: data,
      sortby: column,
      descending: descending
    });
  };

  render() {
    const { sortby, descending, data } = this.state;

    return (
      <table>
        <thead onClick={this._sort}>
          <tr>
            {constHeaders.map((title, idx) => {
              if (sortby === idx) {
                title += descending ? ' \u2191' : ' \u2193';
              }
              return <th key={idx}>{title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowidx) => {
            return (
              <tr key={rowidx}>
                {row.map((cell, idx) => {
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
