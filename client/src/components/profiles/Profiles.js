import React, { Component } from "react";
import ProfileItem from "./ProfileItem";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getProfiles } from "../../actions/profileActions";
import Spinner from "../common/Spinner";

class Profiles extends Component {
  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;

    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      profileItems = profiles.map(profile => (
        <ProfileItem key={profile._id} profile={profile} />
      ));
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse and connect with developers
              </p>

              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.profiles
});

export default connect(
  mapStateToProps,
  { getProfiles }
)(Profiles);
