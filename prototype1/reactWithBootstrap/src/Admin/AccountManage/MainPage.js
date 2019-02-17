import React,{Component} from 'react';
import '../../css/InboxPage.css';
import {Link, Redirect} from 'react-router-dom';
import Header from '../../Common/Header';
import NavigationBar from '../../Common/NavigationBar';

const config = require("../../config");

export default class AdminMainPage extends Component{
  constructor(props){
    super(props);

    this.state={
      logout:false,
      users:[],
      id:-1,
      error:null,
      status:null
    }

    this.logout = this.logout.bind(this);
    this.displayModal = this.displayModal.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.displayTable = this.displayTable.bind(this);
  }

  componentDidMount(){
    let url = config.settings.serverPath + "/api/users";
    fetch(url)
    .then(response=>{
      return response.json();
    })
    .then((users)=>{
      console.log(users);
      this.setState({
        users:users
      });
    })
  }
  
  deleteItem(){
    let url = config.settings.serverPath + "/api/users/" + this.state.id;
    console.log(url);
    fetch(url,{
      method:"DELETE",
      header:{
        Accept: 'application/json',          
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({
        id:this.state.id,
      })
    }).then((response)=>{
      this.setState({
        status:response.status
      },this.render);
      return response.json();
    }).then((response)=>{
      this.setState({
        users:response.users
      },this.render);
    });
  }


  logout(event){
    this.setState({logout:true});
  }

  displayModal(){
    return(
        <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Delete Confirmation</h5>
                    </div>
                    <div className="modal-body">
                        Do You Sure To Delete?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={this.deleteItem}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  displayTable(){
      return(
        <table className="table table-hover">
            <caption>List of users</caption>
            <thead className="thead-light">
                <tr>
                <th>
                    #
                </th>
                <th>
                    Name
                </th>
                <th>
                    Email
                </th>
                <th>
                    Type of User
                </th>
                <th>
                    Creation Time
                </th>
                <th>
                    Last Update Time
                </th>
                <th>
                    Actions
                </th>
                </tr>
            </thead>
            <tbody>
            {this.state.users.map((item,index)=>{
              let role = item.role==='1'?"Volunteer":"Administrator";
                return(
                    <tr>
                        <td>
                            {index+1}
                        </td>
                        <td>
                            {item.name}
                        </td>
                        <td>
                            {item.email}
                        </td>
                        <td>
                            {role}
                        </td>
                        <td>
                            {item.created_at}
                        </td>
                        <td>
                            {item.updated_at}
                        </td>
                        <td>
                        <Link to={{pathname:"/inbox/account/update/" + item.id,state:{user:item}}} style={{marginRight:7}} className="btn">
                            Update
                        </Link>
                        <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#deleteModal" onClick={()=>{this.setState({id:item.id})}}>
                            Delete
                        </button>
                        </td>
                    </tr>
                );
            })}
            </tbody>
        </table>
    );
  }

  render() {
    let successMessage = "none";

    if(this.state.logout){
      return(<Redirect to="/"/>);
    }

    if(this.state.status!=null){
      if(this.state.status===200){
        successMessage = "block";
      }
    }

    return (
      <div className="container">
        <Header logout={this.logout}/>
        <div className="content">
          {this.displayModal()}
          <div className="row">
            <NavigationBar type="manage"/>
            <div className="modal" id="successMessage" tabIndex="-1" role="dialog" style={{display:successMessage,overflowX:"hidden",boxShadow:"0 0 0 5000px rgba(0, 0, 0, 0.75)"}}>
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Success</h5>
                            </div>
                            <div className="modal-body">
                                Delete Successfully
                            </div>
                            <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={()=>{document.getElementById("successMessage").style.display="none"}}>Ok</button>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="col-md-10">
              <div className="tab-content">
                <div className="tab-pane fade in active" id="home">
                  <div className="list-group" style={{overflow: 'auto',maxHeight:550}}>
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-12">
                                    <h3>
                                        Account Management
                                    </h3>
                                    <Link to="/inbox/account/create" className="btn btn-success">
                                        Create New Account
                                    </Link>
                                    {this.displayTable()}
                                    <div className="row">
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}