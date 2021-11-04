import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function GoalsCard({ goalsValue ,handleDetailPage}) {
  const classes = useStyles();

  if(!goalsValue.length){
    return <div>NO Goals</div>
  }

  return (
    <React.Fragment>
      <div className="goalsCard_container">
        {goalsValue && goalsValue.map((val) => (
          <Card className={classes.root} key={val.id} onClick={()=>handleDetailPage(val)} >
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Contemplative Reptile"
                height="140"
                image={val.url}
                title="Contemplative Reptile"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h5">
                  {val.inputValues.eventName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {val.inputValues.description}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
            </CardActions>
          </Card>
        ))}
      </div>
    </React.Fragment>
  );
}
