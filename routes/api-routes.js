const db = require('../models');

module.exports = (app) => {
  //get all workouts for home page
  app.get('/api/workouts', (req, res) => {
    // aggregate method to return an aggregate value in a collection
    db.Workouts.aggregate([
      {
        // add up the exercise.duration field and return it in a new field call total duration
        $addFields: { totalDuration: { $sum: '$exercises.duration' } }
      }
    ])
      .then((workouts) => {
        res.json(workouts);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  // get all workouts for workout dashboard
  app.get('/api/workouts/range', (req, res) => {
    db.Workouts.find({}).then((workouts) => {
      res.json(workouts);
    });
  });

  // create a workout
  app.post('/api/workouts', (req, res) => {
    db.Workouts.create(req.body)
      .then((workout) => {
        res.json(workout);
      })
      .catch((err) => {
        if (err) console.log(err);
      });
  });

  // update a workout
  app.put('/api/workouts/:id', (req, res) => {
    // set the workoutid equal to the object id for easy lookup in the daatabase
    const workoutID = req.params.id;
    // update the record in the database
    db.Workouts.findOneAndUpdate(
      // find record by matching id
      { _id: workoutID },
      // push the data to the exercises array
      { $push: { exercises: req.body } }
    )
      .then((workouts) => {
        res.json(workouts);
      })
      .catch((err) => {
        res.json(err);
      });
  });
};
