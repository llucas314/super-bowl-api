const superBowlsJson = require("./json/superbowls.json");
const halftimesJson = require("./json/halftime_musicians.json");
const viewersJson = require("./json/tv_info.json");
const teamsJson = require("./json/teams.json");
const SuperBowl = require("../models/SuperBowl");
const HalftimePerformer = require("../models/HalftimePerformer");
const Viewership = require("../models/Viewership");

const superBowlsData = superBowlsJson.map(superBowlJson => {
  const superBowl = {
    date: superBowlJson.date,
    super_bowl: superBowlJson.super_bowl,
    venue: { name: superBowlJson.venue },
    city: superBowlJson.city,
    state: superBowlJson.state,
    attendance: superBowlJson.attendance,
    teams: [
      { teamName: superBowlJson.team_winner, winner: true },
      { teamName: superBowlJson.team_loser, winner: false }
    ],
    winning_pts: superBowlJson.winning_pts,
    qb_winner: [superBowlJson.qb_winner_1, superBowlJson.qb_winner_2],
    coach_winner: superBowlJson.coach_winner,
    losing_pts: superBowlJson.losing_pts,
    qb_loser: [superBowlJson.qb_loser_1, superBowlJson.qb_loser_2],
    coach_loser: superBowlJson.coach_loser,
    combined_pts: superBowlJson.combined_pts,
    difference_pts: superBowlJson.difference_pts,
    halftimePerformer: []
  };
  return superBowl;
});
superBowlsData.forEach(superBowl => {
  superBowl.teams.forEach(team => {
    teamsJson.forEach(teamJson => {
      const nameSplit = team.teamName.split(" ");
      const nameWithoutCity = nameSplit[nameSplit.length - 1];
      if (teamJson.strTeam && teamJson.strTeam.includes(nameWithoutCity)) {
        team.logo = teamJson.strTeamBadge;
        team.website = teamJson.strWebsite;
      }
    });
  });
});
superBowlsData.forEach(superBowl => {
  teamsJson.forEach(teamJson => {
    const nameSplit = superBowl.city.replace(",", "").split(" ");
    const cityName = nameSplit[1];
    console.log("teamJson.strStadium", teamJson.strStadium);
    console.log("superBowl.venue.name", superBowl.venue.name);
    if (teamJson.strStadium.includes(superBowl.venue.name)) {
      console.log("found name match");
      superBowl.venue.img = teamJson.strStadiumThumb;
    } else if (
      teamJson.strStadiumLocation &&
      teamJson.strStadiumLocation.includes(superBowl.city)
    ) {
      console.log("found city match");
      superBowl.venue.img = teamJson.strStadiumThumb;
    }
  });
});
const halftimesData = halftimesJson.map(musician => {
  const halftime = {
    super_bowl: musician.super_bowl,
    musician: musician.musician,
    num_songs: musician.num_songs
  };
  return halftime;
});

const viewersData = viewersJson.map(viewInfo => {
  const view = {
    super_bowl: viewInfo.super_bowl,
    network: viewInfo.network,
    avg_us_viewers: viewInfo.avg_us_viewers,
    total_us_viewers: viewInfo.total_us_viewers,
    rating_household: viewInfo.rating_household,
    ad_cost: viewInfo.ad_cost
  };
  return view;
});
SuperBowl.deleteMany({}).then(() => {
  SuperBowl.create(superBowlsData)
    .then(() => {
      console.log("Collection created.");
      halftimesData.forEach(performance => {
        SuperBowl.findOneAndUpdate(
          { super_bowl: performance.super_bowl },
          {
            $push: {
              halftimePerformer: {
                super_bowl: performance.super_bowl,
                musician: performance.musician,
                num_songs: performance.num_songs
              }
            }
          },
          { new: true }
        )
          // .then(result => console.log(result))
          .catch(err => console.log(err));
      });
      viewersData.forEach(show => {
        SuperBowl.findOneAndUpdate(
          { super_bowl: show.super_bowl },
          {
            $set: {
              viewer: {
                super_bowl: show.super_bowl,
                network: show.network,
                avg_us_viewers: show.avg_us_viewers,
                total_us_viewers: show.total_us_viewers,
                rating_household: show.rating_household,
                ad_cost: show.ad_cost
              }
            }
          },
          { new: true }
        )
          // .then(result => console.log(result))
          .catch(err => console.log(err));
      });
    })
    .catch(err => console.log(err));
});
HalftimePerformer.deleteMany({}).then(() => {
  HalftimePerformer.create(halftimesData)
    .then(() => {
      console.log("Collection created.");
    })
    .catch(err => console.log(err));
});
Viewership.deleteMany({}).then(() => {
  Viewership.create(viewersData)
    .then(() => {
      console.log("Collection created.");
    })
    .catch(err => console.log(err));
});
