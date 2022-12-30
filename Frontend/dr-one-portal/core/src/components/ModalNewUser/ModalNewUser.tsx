import * as S from "./ModalNewUser.tyles";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { TextField } from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { useEffect, useState } from "react";
import { apiDashboard, helper } from "@dr-one/utils";
import { SnackBarMessage } from "@dr-one/shared-component";
import isEmail from "../../hooks/utils/isEmail";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  })
);

interface IModalNewUserProps {
  setOpen: (value: boolean) => void;
  open: boolean;
  users: any[];
  setApiUpdate: (value: boolean) => void;
}

const ModalNewUser = (props: IModalNewUserProps) => {
  const { setOpen, open, setApiUpdate, users } = props;
  const classes = useStyles();
  const [openNotification, setOpenNotification] = useState<any>({
    open: false,
    type: "",
    message: "",
  });
  const [activeMFA, setActiveMFA] = useState(false);
  const [attemptFirst, setAttemptFirst] = useState(true);
  const [valueInput, setValueInput] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [roles, setRoles] = useState([
    { name: "Campaign Creator", value: false },
    { name: "Administrator", value: false },
    { name: "Business Manager", value: false },
    { name: "Preload Approver", value: false },
    { name: "Preload Creator", value: false },
    { name: "Campaign Admin", value: false },
  ]);

  const handleSelectRole = (e: any, name: string) => {
    const value = e.target.checked;
    const newRoles = roles.map((role) => {
      if (role.name === name) {
        return {
          ...role,
          value,
        };
      } else return role;
    });
    setRoles(newRoles);
  };

  const handleMFA = (e: any) => {
    setActiveMFA(e.target.checked);
  };

  const handleClose = () => {
    setIsInvalidEmail(false);
    setOpen(false);
    setRoles([
      { name: "Campaign Creator", value: false },
      { name: "Administrator", value: false },
      { name: "Business Manager", value: false },
      { name: "Preload Approver", value: false },
      { name: "Preload Creator", value: false },
      { name: "Campaign Admin", value: false },
    ]);
    setValueInput("");
    setActiveMFA(false);
  };

  const handleValidationEmail = (e: any) => {
    const value = e.target.value.replace(/\s*([*-\s-!-#-%-(-)-])*/gi, "");
    setValueInput(value);
    if (isEmail(value)) {
      setIsInvalidEmail(false);
    } else {
      setIsInvalidEmail(true);
    }
  };

  const handleSaveButton = () => {
    const userExist = users.some((user) => user.email === valueInput);
    if (userExist) {
      return setOpenNotification({
        open: true,
        type: "error",
        message: "User Already Exists",
      });
    }
    const role = roles.filter((role) => role.value).map((role) => role.name);
    const data = {
      user: valueInput,
    };
    apiDashboard
      .post("/api/organization/user/add/", data)
      .then((responseAddUser) => {
        try {
          apiDashboard.post("/api/role/user/add/", { user: valueInput, role });
          apiDashboard.post("/api/users/activate/", data);
          if (activeMFA) {
            apiDashboard.post("/api/users/enable_mfa/", data);
          } else {
            apiDashboard.post("/api/users/disable_mfa/", data);
          }
          if (responseAddUser.status === 200) {
            setOpenNotification({
              open: true,
              type: "success",
              message: "Successful guest user",
            });
            setApiUpdate(true);
          }
        } catch (error) {
          setOpenNotification({
            open: true,
            type: "error",
            message: helper.getErrorMessage(error),
          });
        }
      })
      .catch((error) => {
        setOpenNotification({
          open: true,
          type: "error",
          message: helper.getErrorMessage(error),
        });
      });

    handleClose();
  };
  return (
    <>
      <SnackBarMessage
        severityType={openNotification.type}
        message={openNotification.message}
        open={openNotification.open}
        onClose={() =>
          setOpenNotification({ ...openNotification, open: false })
        }
      />

      <Dialog
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <S.Content>
            <header>
              <p>
                Invite New User
                <span>
                  <HelpOutlineIcon fontSize="small" />
                </span>
              </p>
              <CloseIcon cursor="pointer" onClick={handleClose} />
            </header>
            <main>
              <div>
                <TextField
                  id="outlined-number"
                  label="Email"
                  type="email"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                  className="inputEmail"
                  value={valueInput}
                  onChange={(e) => handleValidationEmail(e)}
                  onFocus={(e) => handleValidationEmail(e)}
                  onBlur={(e) => {
                    handleValidationEmail(e);
                  }}
                  placeholder="example@example.com"
                />
                {isInvalidEmail && <p>Invalid email</p>}
              </div>
              <section className="Checks">
                <p>Manage User Groups</p>

                <S.CheckRoles>
                  {roles.map((role, index) => {
                    return (
                      <fieldset key={index}>
                        <input
                          className="roles-checkbox"
                          type="checkbox"
                          name={role.name}
                          checked={role.value}
                          onChange={(e) => handleSelectRole(e, role.name)}
                        />
                        <label htmlFor="">{role.name}</label>
                      </fieldset>
                    );
                  })}
                </S.CheckRoles>
              </section>
              <fieldset>
                <input
                  className="MFA-checkbox"
                  type="checkbox"
                  checked={activeMFA}
                  onChange={handleMFA}
                />
                <label htmlFor="">MFA Enable</label>
              </fieldset>
            </main>
            <footer>
              <S.ButtonSave
                disabled={
                  isInvalidEmail || valueInput.length < 5 ? true : false
                }
                onClick={handleSaveButton}
              >
                Save
                <ArrowForwardIcon fontSize="small" />
              </S.ButtonSave>
            </footer>
          </S.Content>
        </Fade>
      </Dialog>
    </>
  );
};

export default ModalNewUser;
