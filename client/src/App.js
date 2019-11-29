//jshint esversion:6

import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referralLinks: [],
      renderHome: true,
      currentName: "Bob",
      term: "",
      // order: clientsList.length
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.editListItem = this.editListItem.bind(this);
    this.deleteListItem = this.deleteListItem.bind(this);
  }

  //names need to be unique -- have some type of error response

  componentDidMount() {
    fetch("https://ambserver.herokuapp.com/reflinks")
      .then(response => response.json())
      .then(data => {
        const list = [];
        data.forEach((d) => {
          list.push({name: d.name, clickNum: d.clickNum, id: d._id});
        });
        console.log(list);
        this.setState({
          referralLinks: list
        });
    });
  }

  onSubmit(event) {
    //Add new link - update db - sync w/ this.state
    event.preventDefault();
    //if name is not an empty string
    if (this.state.term) {
      //check if name is already taken
      let isUnique = true;
      this.state.referralLinks.forEach((link) => {
        if (link.name === this.state.term) {
          isUnique = false;
        }
      });
      //if name is unique
      if (isUnique) {
        //post new link to database - default clickNum: 0
        let linkName = {name: this.state.term};
        fetch("https://ambserver.herokuapp.com/reflinks", {
          method: 'POST',
          body: JSON.stringify(linkName),
          headers: {'Content-type': 'application/json'}
        })
        .then(data => {
          console.log('Request success: ', data);
          return fetch("https://ambserver.herokuapp.com/reflinks");
        })
        .then(response => response.json())
        .then(data => {
          const list = [];
          data.forEach((d) => {
            list.push({name: d.name, clickNum: d.clickNum, id: d._id});
          });
          console.log(list);
          this.setState({
            referralLinks: list
          });
        })
        .catch(error => {
          console.log('Request failure: ', error);
        });
      }
    }
    this.setState({
      term: ""
    });
  }

  handleChange(event) {
   this.setState({term: event.target.value});
  }

  handleLinkClick(name) {
    //the link click is reloading the page/hence the issue...
    //need to use react-router-dom

    //update clicks count
    //make server call
    //redirect to landing page via this.state.renderHome and pass value via this.state.currName
    // this.setState({
    //   renderHome: false
    // });
    //possibly refactor all onClicks through an onClick handler w/ helper methods
    console.log("value of name is: " + name);
    console.log("renderHome is: " + this.state.renderHome);
  }

  editListItem(name) {
    //add edit feature
    //new information
    let newName = "Gwen Stacey";
    let newClickNum = 1000;
    let newBody = {
      name: newName,
      clickNum: newClickNum
    };
    //edit database and repopulate data
    let nameUri = encodeURI(name);
    fetch("https://ambserver.herokuapp.com/reflinks/" + nameUri, {
      method: 'PATCH',
      body: JSON.stringify(newBody),
      headers: {'Content-type': 'application/json'}
    })
    .then(data => {
      console.log('Request success: ', data);
      return fetch("https://ambserver.herokuapp.com/reflinks");
    })
    .then(response => response.json())
    .then(data => {
      const list = [];
      data.forEach((d) => {
        list.push({name: d.name, clickNum: d.clickNum, id: d._id});
      });
      console.log(list);
      this.setState({
        referralLinks: list
      });
    })
    .catch(error => {
      console.log('Request failure: ', error);
    });
  }

  deleteListItem(name) {
    //delete item
    let nameUri = encodeURI(name);
    console.log(nameUri);
    fetch("https://ambserver.herokuapp.com/reflinks/" + nameUri, {
      method: 'delete',
      headers: {'Content-type': 'application/json'}
    })
    .then(data => {
      console.log('Request success: ', data);
      return fetch("https://ambserver.herokuapp.com/reflinks");
    })
    .then(response => response.json())
    .then(data => {
      const list = [];
      data.forEach((d) => {
        list.push({name: d.name, clickNum: d.clickNum, id: d._id});
      });
      console.log(list);
      this.setState({
        referralLinks: list
      });
    })
    .catch(error => {
      console.log('Request failure: ', error);
    });
}


  render() {

    if (this.state.renderHome) {
      return (
        <Home
          onSubmit={this.onSubmit}
          term={this.state.term}
          handleChange={this.handleChange}
          referralLinks={this.state.referralLinks}
          handleLinkClick={this.handleLinkClick}
          editListItem={this.editListItem}
          deleteListItem={this.deleteListItem}
        />
      );
    }
    return (
      <Landing currentName={this.state.currentName} />
    );
  }
}

function Home(props) {
  //Home page
  return (
    <div>
      <h1>Grow the web with referrals!</h1>
      <AddNew onSubmit={props.onSubmit} term={props.term} handleChange={props.handleChange} />
      <List referralLinks={props.referralLinks} handleLinkClick={props.handleLinkClick} editListItem={props.editListItem} deleteListItem={props.deleteListItem} />
    </div>
  );
}

function AddNew(props) {
  return (
    <form onSubmit={props.onSubmit}>
      <input className="input-text" value={props.term} onChange={props.handleChange} />
      <button className="btn add-btn">+</button>
    </form>
  );
}

function List(props) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <td>Link Title</td>
            <td>Clicks</td>
            <td>Edit</td>
            <td>Delete</td>
          </tr>
        </thead>
        <tbody>
          {props.referralLinks.map((link) => (
            <tr>
              <td>
                <a key={link.id} href={"/" + link.name} onClick={() => props.handleLinkClick(link.name)}>{link.name}</a>
              </td>
              <td>
                {link.clickNum}
              </td>
              <td onClick={() => props.editListItem(link.name)}>
                Edit
              </td>
              <td onClick={() => props.deleteListItem(link.name)}>
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Landing(props) {
  //Landing page
  return (
    <div>
      <h1>{props.currentName} is the best!</h1>
      <h2>Come join your fellow web-heads on the World Wide Web!</h2>
      <img className="spdImg" src="./wwwSpiderMan.png" alt="spiderman hanging from world wide web" />
    </div>
  );
}


export default App;
