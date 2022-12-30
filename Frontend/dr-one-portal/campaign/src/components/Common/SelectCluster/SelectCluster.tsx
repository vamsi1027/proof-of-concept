import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import * as S from "./SelectCluster.styles";

interface ISelectClusterProps {
  clusters: {
    key: string;
    value: {
      name: string;
      reach: number;
    };
  }[];
  clusterSelected: string;
  setClusterSelected: (string) => void;
}

const SelectCluster = ({
  clusters,
  clusterSelected,
  setClusterSelected,
}: ISelectClusterProps) => {
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      formControl: {
        width: 200,
        fontSize: 12,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
        fontSize: 12,
      },
      inputLabel: {
        fontSize: 12,
      },
      select: {
        height: 50,
        fontSize: 12,
      },
    })
  );
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
    setClusterSelected(event.target.value);
  };

  return (
    <S.Container>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel
          id="demo-simple-select-outlined-label"
          className={classes.inputLabel}
        >
          Search audience cluster
        </InputLabel>
        <Select
          className={classes.select}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={clusterSelected}
          onChange={handleChange}
          label="Search audience cluster"
        >
          {clusters.map((cluster, index) => {
            return (
              <MenuItem
                key={index}
                value={cluster.value.name}
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <S.MenuItem>
                  <p>{cluster.value.name}</p>
                  <p>
                    <img
                      src="/img/people_outline-icon.svg"
                      alt="people outline icon"
                    />
                    {cluster.value.reach}
                  </p>
                </S.MenuItem>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </S.Container>
  );
};

export default SelectCluster;
