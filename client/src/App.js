//jshint esversion:6

import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referralLinks: [],
      renderHome: true,
      currentName: "",
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
    event.preventDefault();
    //if name is not an empty string
    if (this.state.term) {
      //check if name is already taken
      let newName = true;
      this.state.referralLinks.forEach((link) => {
        if (link.name === this.state.term) {
          newName = false;
        }
      });
      //if name is unique
      if (newName) {
        let linkName = {name: this.state.term};
        fetch("https://ambserver.herokuapp.com/reflinks", {
          method: 'POST',
          body: JSON.stringify(linkName),
          headers: {'Content-type': 'application/json'}
        })
        .then(data => {
          console.log('Request success: ', data);
        })
        .catch(error => {
          console.log('Request failure: ', error);
        });
      }
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
      //chain get request to update
    }
  }

  syncWDataBase() {
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

  handleChange(event) {
   this.setState({term: event.target.value});
  }

  handleLinkClick(id) {
    //update clicks count

    //possibly refactor all onClicks through an onClick handler w/ helper methods
    console.log("handle link click: " + id);
  }

  editListItem(id) {
    //add edit feature
    console.log("edit: " + id);
  }

  deleteListItem(id) {
    //delete item
    console.log("delete list item: " + id);
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
                <a key={link.id} href={"/" + link.name} onClick={() => props.handleLinkClick(link.id)}>{link.name}</a>
              </td>
              <td>
                {link.clicks}
              </td>
              <td onClick={() => props.editListItem(link.id)}>
                Edit
              </td>
              <td onClick={() => props.deleteListItem(link.id)}>
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
      <img src="https://cdn.vox-cdn.com/thumbor/up9Mk1FY99BPcDxD9bA2YeRlKZE=/0x0:2640x1760/1200x800/filters:focal(1075x432:1497x854)/cdn.vox-cdn.com/uploads/chorus_image/image/65152362/spider.0.jpg" alt="spider-people" />
    </div>
  );
}


export default App;
