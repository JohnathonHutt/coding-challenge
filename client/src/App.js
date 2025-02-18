//jshint esversion:6

import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referralLinks: [],
      currentName: "",
      term: "",
      editName: "",   //current name being edited
      nameTerm: "",   //value in edit name input
      clickTerm: "",  //value in edit clickNum input
    };
    this.sortByClicks = this.sortByClicks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleLinkClick = this.handleLinkClick.bind(this);
    this.editListItem = this.editListItem.bind(this);
    this.deleteLink = this.deleteLink.bind(this);
    this.handleChangeLink = this.handleChangeLink.bind(this);
    this.handleChangeClick = this.handleChangeClick.bind(this);
    this.resetCurrentName = this.resetCurrentName.bind(this);
  }

  componentDidMount() {
    //populate referralLinks from db on mount
    fetch("https://ambserver.herokuapp.com/reflinks")
      .then(response => response.json())
      .then(data => {
        const list = [];
        data.forEach((d) => {
          list.push({name: d.name, clickNum: d.clickNum, id: d._id});
        });
        console.log(list);
        this.setState({
          referralLinks: this.sortByClicks(list)
        });
    });
  }

  sortByClicks(referralLinks) {
    //helper method - sorts referralLinks by clickNum property
    return referralLinks.sort((a,b) => b.clickNum - a.clickNum);
  }

  resetCurrentName() {
    //resets this.state.currentName from url if empty (i.e. landing page reload)
    //used in Landing component
    let decoded = decodeURI(window.location.href);
    let splitUrl = decoded.split("/");
    let currName = splitUrl[splitUrl.length - 1];
    this.setState({
      currentName: currName
    });
  }

  onSubmit(event) {
    //Add new link - update db - sync referralLinks
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
            referralLinks: this.sortByClicks(list)
          });
        })
        .catch(error => {
          console.log('Request failure: ', error);
        });
      }
    }
    //clear add link input term
    this.setState({
      term: ""
    });
  }

  handleChange(event) {
    //handle change for add link input
    console.log(event.target);
    console.log(event.target.value);
   this.setState({term: event.target.value});
  }

  handleChangeLink(event) {
    //handle change for edit link-name input
    console.log(event.target);
    console.log(event.target.value);
    this.setState({nameTerm: event.target.value});
  }

  handleChangeClick(event) {
    //handle change for edit link-clickNum input
    console.log(event.target);
    console.log(event.target.value);
    this.setState({clickTerm: event.target.value});
  }

  handleLinkClick(name, clickNum) {
    //increment clickNum and pass currentName value for landing page
    this.setState({
      currentName: name,
    });
    //increment clickNum and sync w/ db
    let newClickNum = clickNum +=1;
    let newBody = {
      name: name,
      clickNum: newClickNum
    };
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
        referralLinks: this.sortByClicks(list)
      });
    })
    .catch(error => {
      console.log('Request failure: ', error);
    });
  }

  editListItem(name, clickNum) {
    //turns "on" edit input fields or turns off/saves edits
    //turn on edit fields
    if (!this.state.editName) {
      this.setState({
        editName: name,
        nameTerm: name,
        clickTerm: clickNum,
      });
    //if edit is active and click is on active field
    } else if (name === this.state.editName) {
      //set new information
      let newName = this.state.nameTerm;
      let newClickNum;
      if (Number(this.state.clickTerm)) { newClickNum = this.state.clickTerm; }
      let newBody = { name: newName, clickNum: newClickNum };
      //update database and repopulate data
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
          referralLinks: this.sortByClicks(list),
          edit: false,
          editName: "",
        });
      })
      .catch(error => {
        console.log('Request failure: ', error);
      });
    }
  }

  deleteLink(name) {
    //deletes link
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
        referralLinks: this.sortByClicks(list)
      });
    })
    .catch(error => {
      console.log('Request failure: ', error);
    });
  }

  render() {
    //Site routes
    return (
      <Router>
          <Switch>
            <Route exact path="/">
              <Home
                onSubmit={this.onSubmit}
                term={this.state.term}
                handleChange={this.handleChange}
                referralLinks={this.state.referralLinks}
                handleLinkClick={this.handleLinkClick}
                editListItem={this.editListItem}
                deleteLink={this.deleteLink}
                editName={this.state.editName}
                handleChangeLink={this.handleChangeLink}
                nameTerm={this.state.nameTerm}
                handleChangeClick={this.handleChangeClick}
                clickTerm={this.state.clickTerm}
              />
              </Route>
              <Route path={"/" + this.state.currentName}>
                <Landing currentName={this.state.currentName} resetCurrentName={this.resetCurrentName} />
              </Route>
            </Switch>
        </Router>
      );
    }
  }

function Home(props) {
  //Home page
  return (
    <div>
      <h1 className="title">Grow the web with referrals!</h1>
      <AddNew onSubmit={props.onSubmit} term={props.term} handleChange={props.handleChange} />
      <List
        referralLinks={props.referralLinks}
        handleLinkClick={props.handleLinkClick}
        editListItem={props.editListItem}
        deleteLink={props.deleteLink}
        editName={props.editName}
        handleChangeLink={props.handleChangeLink}
        nameTerm={props.nameTerm}
        handleChangeClick={props.handleChangeClick}
        clickTerm={props.clickTerm}
      />
    </div>
  );
}

function AddNew(props) {
  //Home > AddNew
  return (
    <form onSubmit={props.onSubmit}>
      <input className="input-text" value={props.term} onChange={props.handleChange} placeholder="Add a new link" />
      <button className="add-btn"></button>
    </form>
  );
}

function List(props) {
  //Home > List
  return (
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Link</th>
              <th>Clicks</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <TableLinks
            referralLinks={props.referralLinks}
            handleLinkClick={props.handleLinkClick}
            editListItem={props.editListItem}
            deleteLink={props.deleteLink}
            editName={props.editName}
            handleChangeLink={props.handleChangeLink}
            nameTerm={props.nameTerm}
            handleChangeClick={props.handleChangeClick}
            clickTerm={props.clickTerm}
          />
        </table>
      </div>
  );
}

function TableLinks(props) {
  //Home > List > TableLinks
  //diplays referralLinks
  return (
    <tbody>
      <tr className="spacer">
      </tr>
      {props.referralLinks.map((link) => (
        <tr key={link.id}>
          <td className="link-col">
            {props.editName === link.name ? (
              <input type="text" value={props.nameTerm} onChange={props.handleChangeLink} />
            ) : (
              <Link className="link" to={"/" + link.name} onClick={() => props.handleLinkClick(link.name, link.clickNum)}>{link.name}</Link>
            )}
          </td>
          <td className="col">
            {props.editName === link.name ? (
              <input type="text" value={props.clickTerm} onChange={props.handleChangeClick} />
            ) : (
              link.clickNum
            )}
          </td>
          <td>
            <div className="switch" onClick={() => props.editListItem(link.name, link.clickNum)}>
              <div className={`outer-slider ${(props.editName === link.name) ? " outer-active" : ""}`}>
                <div className={`inner-slider ${(props.editName === link.name) ? " inner-active" : ""}`}>
                </div>
              </div>
            </div>
          </td>
          <td className="col delete" onClick={() => props.deleteLink(link.name)}>
            <span className="delete">Delete</span>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

function Landing(props) {
  //Landing page
  if (!props.currentName) {
    //Resets currentName from url if currentName is blank (i.e. page reloads)
    props.resetCurrentName();
  }
  return (
    <div>
      <h1>{props.currentName} is the best!</h1>
      <h2 className="sub-title">Join your fellow web-heads on the World Wide Web!</h2>
      {/* wwwSpiderMan image by Johnathon Hutt */}
      <img className="spdImg" src="./wwwSpiderMan.png" alt="spiderman hanging from world wide web" />
      <LandingLinks />
    </div>
  );
}

function LandingLinks(props) {
  //Landing page > LandingLinks
  return (
    <div className="row">
      <div className="card">
        <h3 className="card-title">About the Web</h3>
        <ul>
          <li>
            <a className="link" href="https://webfoundation.org/about/vision/history-of-the-web/">Histroy of the Web</a>
          </li>
          <li>
            <a className="link" href="https://webfoundation.org/about/sir-tim-berners-lee/">Sir Tim Berners-Lee (founder)</a>
          </li>
          <li>
            <a className="link" href="https://www.w3.org/">World Wide Web Consortium</a>
          </li>
          <li>
            <a className="link" href="https://en.wikipedia.org/wiki/World_Wide_Web">World Wide Web - Wikipedia</a>
          </li>
        </ul>
      </div>
      <div className="card">
        <h3 className="card-title">Learn On the Web</h3>
        <ul>
          <li>
            <a className="link" href="https://www.wikipedia.org/">Wikipedia: The Free Encycolopedia</a>
          </li>
          <li>
            <a className="link" href="https://www.edx.org/">edX: Free and Affordable Education</a>
          </li>
          <li>
            <a className="link" href="https://www.udemy.com/">Udemy: Affordable Online Education</a>
          </li>
          <li>
            <a className="link" href="https://developer.mozilla.org/en-US/">MDN: Learn About Web Technologies</a>
          </li>
        </ul>
      </div>
      <div className="card">
        <h3 className="card-title">Fun On the Web</h3>
        <ul>
          <li>
            <a className="link" href="https://www.youtube.com/">YouTube: Watch and Share Videos</a>
          </li>
          <li>
            <a className="link" href="https://www.reddit.com/">Reddit: The Front Page of The Internet</a>
          </li>
          <li>
            <a className="link" href="https://medium.com/">Medium: Online Publishing</a>
          </li>
          <li>
            <a className="link" href="https://twitter.com">Twitter: Short Form Conversations With the World</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
