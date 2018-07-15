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
    if (this.state.search) {
      this.setState({
        data: this._preSearchData,
        search: !this.state.search
      });
      this._preSearchData = null;
    } else {
      this._preSearchData = this.state.data;
      this.setState({
        search: !this.state.search
      });
    }
  };

  _search = e => {
    var needle = e.target.value.toLowerCase();
    console.log({ needle });

    if (!needle) {
      this.setState({
        data: this._preSearchData
      });
      return;
    }
    var idx = e.target.dataset.idx;
    var searchdata = this._preSearchData.filter(row => {
      return (
        row[idx]
          .toString()
          .toLowerCase()
          .indexOf(needle) > -1
      );
    });
    this.setState({
      data: searchdata
    });
  };

  _download = (format, ev) => {
    var contents =
      format === 'json'
        ? JSON.stringify(this.state.data)
        : this.state.data.reduce((result, row) => {
            return (
              result +
              row.reduce((rowresult, cell, idx) => {
                return (
                  rowresult +
                  '"' +
                  cell.replace(/"/g, '""') +
                  '"' +
                  (idx < row.length - 1 ? ',' : '')
                );
              }, '') +
              '\n'
            );
          }, '');
    var URL = window.URL || window.webkitURL;
    var blob = new Blob([contents], { type: 'text/' + format });
    ev.target.href = URL.createObjectURL(blob);
    ev.target.download = 'data. ' + format;
  };

  render() {
    const { sortby, descending, data, edit, search } = this.state;

    return (
      <div>
        <button onClick={this._toggleSearch}>Search</button>
        <button>
          <a onClick={this._download.bind(this, 'json')} href="data.json">
            Export JSON
          </a>
        </button>
        <button>
          <a onClick={this._download.bind(this, 'csv')} href="data.csv">
            Export CSV
          </a>
        </button>
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
            {search ? (
              <tr onChange={this._search}>
                {constHeaders.map((_ignore, idx) => {
                  return (
                    <td key={idx}>
                      <input type="text" data-idx={idx} />
                    </td>
                  );
                })}
              </tr>
            ) : null}
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
