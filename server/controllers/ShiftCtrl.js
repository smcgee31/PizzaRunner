/* eslint-disable node/no-unsupported-features */

'use strict';

const Shift = require('../models/ShiftModel');
const Trip = require('../models/TripsModel');
const User = require('../models/UserModel');

exports.createNewShift = async(req, res) => {
  const shift = new Shift(req.body);

  await shift.save((error, response) => {
    if (error) {
      res.status(500).json(error);
    } else {
      User.findByIdAndUpdate(req.params.id, { $push: { shifts: response._id } }, (err, resp) => { // eslint-disable-line no-underscore-dangle
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(resp);
        }
      });
    }
  });
};

exports.createTrip = async(req, res) => {
  const trip = new Trip(req.body);

  await trip.save((error, response) => {
    if (error) {
      res.status(500).json(error);
    } else {
      Shift.findOneAndUpdate({ shiftId: req.params.id }, { $push: { trips: response._id } }, (err, resp) => { // eslint-disable-line no-underscore-dangle
        if (err) {
          res.status(500).json(err);
        } else {
          res.status(200).json(resp);
        }
      });
    }
  });
};

// TODO: fix the following function, probably rewrite
exports.getUsersShifts = async(req, res) => {
  await User.findById(req.params.id, (error, response) => {
    if (error) {
      res.status(500).json(error);
    } else {
      Shift.find({}, (error, shifts));
      const shiftMap = {};

      shifts.forEach((shift) => {
        shiftMap[shift._id] = shift; // eslint-disable-line no-underscore-dangle
      });
      res.status(200).json(shiftMap);
    }
  });
};

