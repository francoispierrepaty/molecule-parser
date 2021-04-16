import React from 'react';
import axios from 'axios';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {formula: '', atoms: false, sentFormula: '', hasAnswered: false, error: false};

    this.compute = this.compute.bind(this);
    this.handleFormulaChange = this.handleFormulaChange.bind(this);
  }

  compute(e) {
    e.preventDefault();

    axios({
      method: 'post',
      url: 'https://molecular-parser-joko.herokuapp.com',
      headers: {'content-type': 'application/json'},
      data: {
        formula: this.state.formula
      }
    })
    .then(result => {
      this.setState({
        atoms: result.data.atoms,
        hasAnswered: true,
        sentFormula: this.state.formula
      });
    })
    .catch(error => {
      this.setState({
        error: error.response
      });
    });
  }

  handleFormulaChange(e) {
    this.setState({formula: e.target.value});
  }

  render() {
    let atoms = (!this.state.atoms || typeof this.state.atoms === 'string') ? {} : this.state.atoms;
    const atomsList = Object.entries(atoms).map(([atom,number]) =>
      <li key={atom}>
        {atom}: {number}
      </li>
    );
    return (
      <div>
        <div className="masthead-brand">
          <img src="logo512.png" width="100px" alt="Molecular Parser" className="logo" />
        </div>
        
        <div className="container row">
          <form className="form-signin">
            <div className="text-center mb-4">
              <h1 className="h3 mb-3 font-weight-normal">How many atoms are there in my molecule?</h1>
              <h5>Enter the chemical formula below</h5>

              <div className="form-label-group">
                <input type="text" name="formula" id="formula" placeholder="Formula" className="form-control"
                        value={this.state.formula} onChange={this.handleFormulaChange} required autoFocus />
                <label htmlFor="formula">Formula</label>
              </div>
              
              <button className="btn btn-lg btn-primary btn-block" onClick={this.compute}>Compute the number of each atom</button>
            </div>

            {this.state.hasAnswered && (!this.state.atoms || typeof this.state.atoms === 'string') ?
              <div className="alert span5 alert-danger">
                <h5>Invalid Formula</h5>
                {!this.state.atoms && <p>Please check the formula{"'"}s syntax</p>}
                {typeof this.state.atoms === 'string' && <p>The element "{this.state.atoms}" does not exist</p>}
              </div>
              :
              this.state.hasAnswered && Object.keys(atoms).length > 0 &&
                <div className="alert span5 alert-info">
                  <h5>The molecule {this.state.sentFormula} is made of:</h5>
                  <ul className="icons">
                    {atomsList}
                  </ul>
                </div>
            }
            {
              this.state.error && 
              <div className="alert span5 alert-danger">
                <h5>Server Error</h5>
                <p>Teh following error has occured, please retry later: <em>{this.state.error}</em></p>
              </div>
            }
          </form>

        </div>
      </div>
    );
  }
}


export default App
