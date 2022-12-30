import { useState } from "react";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import CloseIcon from "@material-ui/icons/Close";
import { TextField } from "@material-ui/core";
import * as S from "./ModalEditUser.styles";
import { apiDashboard } from "@dr-one/utils";

interface IModalEditUserProps {
  setOpen: (value: string) => void;
  dataUser: {
    name: string;
    email: string;
    company: string;
    is_active: boolean;
    phone: string;
    roles: [];
  };
  setApiUpdate: (value: boolean) => void;
}

const ModalEditUser = ({
  setOpen,
  dataUser,
  setApiUpdate,
}: IModalEditUserProps) => {
  const [user, setUser] = useState({
    last_name: dataUser.name.split(" ")[dataUser.name.split(" ").length - 1],
    first_name: dataUser.name.split(" ")[0],
    phone: dataUser.phone,
  });

  const onChangeUser = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const data = {
      ...user,
    };
    console.log(user)
    // apiDashboard.put("/api/users/profile/detail/", data).then((response) => {
    //   if(response.status === 200){
    //     setOpen('')
    //     setApiUpdate(true);
    //   }
    // });
  };

  return (
    <S.Container>
      <S.Content>
        <header>
          <p>Edit User</p>
          <CloseIcon cursor="pointer" onClick={() => setOpen("")} />
        </header>
        <main>
          <TextField
            id="outlined"
            label="Email"
            type="email"
            name="email"
            disabled={true}
            value={dataUser.email}
            variant="outlined"
            className="email"
          />
          <TextField
            id="outlined-number"
            label="First Name"
            name="first_name"
            variant="outlined"
            className="input"
            InputLabelProps={{
              shrink: true,
            }}
            value={user.first_name}
            onChange={onChangeUser}
            placeholder="ex: Maria"
          />
          <TextField
            id="outlined-number"
            label="Last Name"
            name="last_name"
            variant="outlined"
            className="input"
            InputLabelProps={{
              shrink: true,
            }}
            value={user.last_name}
            onChange={onChangeUser}
            placeholder="ex: Maria"
          />
          <TextField
            id="outlined"
            label="Company"
            name="company"
            type="text"
            disabled={true}
            variant="outlined"
            className="input"
            value={dataUser.company}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder="ex: Flowsense"
          />
          <TextField
            id="outlined"
            label="Phone"
            name="phone"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            value={user.phone}
            variant="outlined"
            className="input"
            placeholder="ex: +55 11 991928384"
            onChange={onChangeUser}
          />
        </main>
        <footer>
          <S.ButtonSave onClick={handleSave}>
            Save
            <ArrowForwardIcon fontSize="small" />
          </S.ButtonSave>
        </footer>
      </S.Content>
    </S.Container>
  );
};

export default ModalEditUser;
