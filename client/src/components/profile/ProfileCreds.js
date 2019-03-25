import React, { Component } from "react";

export default class ProfileCreds extends Component {
  render() {
    const { experience, education } = this.props;

    const expItems = experience.map((exp, index) => (
      <li className="list-group-item" key={index}>
        <h4>{exp.company}</h4>
        <p>Oct 2011 - Current</p>
        <p>
          <strong>Position:</strong> {exp.title}
        </p>
        <p>
          <strong>Description:</strong> {exp.description}
        </p>
      </li>
    ));

    const eduItems = education.map((edu, index) => (
      <li className="list-group-item" key={index}>
        <h4>{edu.school}</h4>
        <p>Sep 1993 - June 1999</p>
        <p>
          <strong>Degree: </strong>
          {edu.degree}
        </p>
        <p>
          <strong>Field Of Study: </strong>
          {edu.fieldofstudy}
        </p>
        <p>
          <strong>Description:</strong> {edu.description}
        </p>
      </li>
    ));
    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          <ul className="list-group">{expItems}</ul>
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          <ul className="list-group">{eduItems}</ul>
        </div>
      </div>
    );
  }
}
