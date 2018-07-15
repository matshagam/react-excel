import React, { Component } from 'react';
import './App.css';

import { constHeaders, constData } from './helpers';

export default class Excel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: constData,
      descending: false,
      sortby: null,
      edit: null,
      search: false
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

  _showEditor = e => {
    this.setState({
      edit: {
        row: parseInt(e.target.dataset.row, 10),
        cell: e.target.cellIndex
      }
    });
  };

  _save = e => {
    e.preventDefault();
    var input = e.target.firstChild;
    var data = Array.from(this.state.data);
    data[this.state.edit.row][this.state.edit.cell] = input.value;
    this.setState({
      edit: null,
      data: data
    });
  };

  _toggleSearch = () => {
    this.setState({
      search: !this.state.search
    });
  };

  render() {
    const { sortby, descending, data, edit } = this.state;

    return (
      <div>
        <button onClick={this._toggleSearch}>Search</button>
        <table>
          <thead onClick={this._sort}>
            {this.state.search ? (
              <tr onChange={this._search}>
                {constHeaders.map((_ignore, idx) => {
                  return (
                    <td key={idx}>
                      <input type="text" data-idx={idx} />
                    </td>
                  );
                })}
              </tr>
            ) : (
              <tr>
                {constHeaders.map((title, idx) => {
                  if (sortby === idx) {
                    title += descending ? ' \u2191' : ' \u2193';
                  }
                  return <th key={idx}>{title}</th>;
                })}
              </tr>
            )}
          </thead>
          <tbody onDoubleClick={this._showEditor}>
            {data.map((row, rowidx) => {
              return (
                <tr key={rowidx}>
                  {row.map((cell, idx) => {
                    var content = cell;
                    if (edit && edit.row === rowidx && edit.cell === idx) {
                      content = (
                        <form onSubmit={this._save}>
                          <input type="text" defaultValue={cell} />
                        </form>
                      );
                    }
                    return (
                      <td key={idx} data-row={rowidx}>
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
