import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;
    const skills = profile.skills.map((skill, index) => (
      <li className="list-group-item" key={index}>
        <i className="fa fa-check pr-1" />
        {skill}
      </li>
    ));
    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img className="rounded-circle" src={profile.user.avatar} alt="" />
          </div>
          <div className="col-lg-6 col-md-4 col-8">
            <h3>{profile.user.name}</h3>
            <p>
              {profile.status}
              {isEmpty(profile.company) ? null : (
                <span>at {profile.company}</span>
              )}
            </p>
            <p>
              {isEmpty(profile.company) ? null : (
                <span>at {profile.company}</span>
              )}
            </p>
            <Link to={`/profile/${profile.handle}`} className="btn btn-info">
              View Profile
            </Link>
          </div>
          <div className="col-md-4 d-none d-lg-block">
            <h4>Skill Set</h4>
            <ul className="list-group">{skills}</ul>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profiles: PropTypes.object.isRequired
};

export default ProfileItem;
