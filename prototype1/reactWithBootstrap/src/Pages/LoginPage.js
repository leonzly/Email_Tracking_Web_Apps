import React, { Component } from 'react';
import '../css/LoginPage.css';
import {Redirect} from 'react-router';
import Cookies from 'universal-cookie';

const config = require('../config');
const cookies = new Cookies();

export default class LoginPage extends Component {

  constructor(props){
    super(props);

    this.state={
      email:'',
      password:'',
      username:'',
      status:null
    };

    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(event){
    if(event.target.name === 'email'){
      this.setState({
        email:event.target.value
      });
    }
    else if (event.target.name === 'password') {
      this.setState({
        password:event.target.value
      });
    }
  }

  submit(event){
    event.preventDefault();
    let url = config.settings.serverPath + "/api/login";

    fetch(url,{
      method: 'POST',                       
      headers: {
        Accept: 'application/json',          
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({                
        email: this.state.email,
        password: this.state.password
      }),
    }).then((response) => {
      
      return response.json();
    }).then((response)=>{
      console.log(response.error);
      if(response.error!==undefined && response !== null){
        if(response.error === 404){
          this.setState({
            status:404
          });
        }
        if(response.error === 400){
          this.setState({
            status:400
          });
        }
      }
      else{
        cookies.set('username',response.name,{ path: '/' });
        this.setState({
          status:200
        });
      }
      this.forceUpdate();
    });
  }

  render() {
    let errorMessage = <div className="ErrorMessage"></div>;

    if(this.state.status){
      console.log(this.state.status);
      if(this.state.status === 404){
        errorMessage = <div className="ErrorMessage">Invalid Email</div>
      }
      else if(this.state.status === 400){
        errorMessage = <div className="ErrorMessage">Invalid Password</div>
      }
      else if(this.state.status === 200){
        return(<Redirect to="/inbox"/>);
      }
    }

    return (
      <div id="LoginPage">
        <div className="App">
          <div className="Login">
            <div className="LogoDiv">
              <img className="Logo" src="/images/logo.png" alt="Befrienders"/>
            </div>
            <form className="Form" method="post" onSubmit={this.submit}>
              <input className="form-control form-control-lg" onChange={this.handleChange} placeholder="Email" type="text" name="email" required/>
              <br/>

              <input onChange={this.handleChange} placeholder="Password" type="password" name="password" required/>
              {errorMessage}
              <button className="Button" type="submit" value="Login">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}