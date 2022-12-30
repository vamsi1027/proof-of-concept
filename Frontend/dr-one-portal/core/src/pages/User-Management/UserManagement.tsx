import { Suspense, lazy } from "react";
import { SnackBarMessage } from "@dr-one/shared-component";
import AddIcon from "@material-ui/icons/Add";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TableUsers from "../../components/TableUsers/TableUsers";
import Pagination from "@material-ui/lab/Pagination";
import * as S from "./UserManagement.styles";
import { apiDashboard, userHasPermission } from "@dr-one/utils";
import { CircularProgress } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
const ModalNewUser = lazy(
  () => import("../../components/ModalNewUser/ModalNewUser")
);
const TablePermisions = lazy(
  () => import("../../components/TablePermisions/TablePermisions")
);

const UserManagement = () => {
  const history = useHistory();
  const usersPerPage = 8;
  const [openModal, setOpenModal] = useState(false);
  const [apiUpdate, setApiUpdate] = useState(false);
  const [loadSpinner, setLoadSpinner] = useState(false);
  const [originalData, setOriginalData] = useState<any>([]);
  const [usersRender, setUsersRender] = useState([]);
  const [load, setLoad] = useState(false);
  const [colorArrowSort, setColorArrowSort] = useState<any>({
    name: "",
    company: "",
    phone: "",
    email: "",
  });
  const [pageSettings, setPageSettings] = useState({
    currentPage: 1,
    totalPages: 1,
    firstUser: 0,
    lastUser: usersPerPage,
  });
  const [notification, setNotification] = useState<any>({
    open: false,
    type: "success",
    message: "",
  });
  const [sortTable, setSortTable] = useState({
    key: "name",
    direction: "up",
  });
  const [filters, setFilters] = useState({
    searchValue: "",
    mfa: "",
    status: "",
    roles: [
      { name: "Preload Approver", value: "" },
      { name: "Preload Creator", value: "" },
      { name: "Business Manager", value: "" },
      { name: "Administrator", value: "" },
      { name: "Campaign Creator", value: "" },
      { name: "Campaign Admin", value: "" },
    ],
  });
  useEffect(() => {
    handleUsersSearch();
  }, [originalData]);
  const requestAPI = () => {
    setLoadSpinner(true);
    apiDashboard.get("/api/users/list/").then((originalData) => {
      const users = Object.entries(originalData.data);
      const arrayUsers = users.map((user) => {
        const objUser: any = user[1];
        return {
          ...objUser,
          email: user[0],
        };
      });
      setOriginalData(arrayUsers);
      setLoadSpinner(false);
      setUsersRender(arrayUsers);
      setPageSettings({
        ...pageSettings,
        totalPages: Math.ceil(arrayUsers.length / usersPerPage),
      });
    });
  };
  const setRoles = (email: any, role: string) => {
    setLoad(true);
    let message = "";
    const [filteredUser] = originalData.filter(
      (user: any) => user.email === email
    );
    let roles = filteredUser.roles;
    if (!roles.includes(role)) {
      message = "Role added successfully";
      roles = roles.concat(role);
    } else {
      message = "Role romoved successfully";
      roles = roles.filter((currentRole: any) => currentRole !== role);
    }
    const userUpdated = usersRender.map((user: any) => {
      return user.email === email ? { ...filteredUser, roles } : user;
    });
    const userUpdatedOriginal = originalData.map((user: any) => {
      return user.email === email ? { ...filteredUser, roles } : user;
    });
    apiDashboard
      .post("/api/role/user/add/", { user: email, role: roles })
      .then((response) => {
        if (response.status === 200) {
          setNotification({
            open: true,
            type: "success",
            message: message,
          });
          setLoad(false);
          setUsersRender(userUpdated);
          setOriginalData(userUpdatedOriginal);
        }
      })
      .catch((error) => {
        setNotification({
          open: true,
          type: "error",
          message: "Failed",
        });
      });
  };
  const handleUpdateFilters = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };
  const handleUpdateFilterRoles = (value, role) => {
    const roles = filters.roles.map((currentRole) => {
      currentRole.name === role ? (currentRole.value = value) : null;
      return currentRole;
    });
    setFilters({ ...filters, roles });
  };
  const handleUsersSearch = () => {
    const sortUsers = handleSort(originalData);
    const userMfaSearch = handleMfa(sortUsers);
    const userStatusSearch = handleStatus(userMfaSearch);
    const userRolesSearch = handleRoles(userStatusSearch);
    const textSearch = handleSearch(userRolesSearch);

    setUsersRender(textSearch);
    setPageSettings({
      ...pageSettings,
      currentPage: 1,
      firstUser: 0,
      lastUser: usersPerPage,
      totalPages: Math.ceil(textSearch.length / usersPerPage),
    });
  };
  const handleMfa = (users) => {
    return users.filter((user) => {
      if (filters.mfa === "active") {
        return user.mfa_on;
      }
      if (filters.mfa === "inactive") {
        return !user.mfa_on;
      }
      return true;
    });
  };
  const handleStatus = (users) => {
    return users.filter((user) => {
      if (filters.status === "active") {
        return user.is_active;
      }
      if (filters.status === "inactive") {
        return !user.is_active;
      }
      return true;
    });
  };
  const handleRoles = (users) => {
    return users.filter((user) => {
      const filteredRoles = filters.roles.filter((role) => !!role.value);
      if (!filteredRoles.length) return true;
      return filteredRoles.every((role) => {
        return role.value.includes("selected")
          ? user.roles.includes(role.name)
          : !user.roles.includes(role.name);
      });
    });
  };
  const handleSearch = (users) => {
    const usersFiltered = users.filter((user) => {
      if (
        user.email.toUpperCase().includes(filters.searchValue.toUpperCase())
      ) {
        return user;
      } else if (
        user.company.toUpperCase().includes(filters.searchValue.toUpperCase())
      ) {
        return user;
      } else if (
        user.name.toUpperCase().includes(filters.searchValue.toUpperCase())
      ) {
        return user;
      }
    });
    return usersFiltered;
  };
  const handleSort = (users) => {
    const usersSort = users.sort((a: any, b: any) => {
      if (sortTable.direction) {
        return a[sortTable.key].toUpperCase() < b[sortTable.key].toUpperCase()
          ? 1
          : -1;
      } else {
        return b[sortTable.key].toUpperCase() < a[sortTable.key].toUpperCase()
          ? 1
          : -1;
      }
    });
    return usersSort;
  };
  const handleChangeStatus = (e: any, email: string) => {
    setLoad(true);
    const status = e.target.value === "active" ? true : false;
    const usersFilteredRender = usersRender.map((currentUser) => {
      if (currentUser.email === email) {
        currentUser.status = status;
      }
      return currentUser;
    });
    const usersFilteredOriginalData = originalData.map((currentUser) => {
      if (currentUser.email === email) {
        currentUser.status = status;
      }
      return currentUser;
    });
    const url =
      e.target.value === "active"
        ? "/api/users/activate/"
        : "/api/users/deactivate/";
    const message =
      e.target.value === "active" ? "User activated" : "User inactive";
    apiDashboard
      .post(url, { user: email })
      .then(() => {
        setUsersRender(usersFilteredRender);
        setOriginalData(usersFilteredOriginalData);
        setLoad(false);
        setNotification({
          open: true,
          type: "success",
          message: message,
        });
      })
      .catch(() => {
        setLoad(false);
        setNotification({
          open: true,
          type: "error",
          message: "Failed",
        });
      });
  };
  const handleChangeMFA = (e: any, email: string) => {
    setLoad(true);
    const mfa = e.target.value === "active" ? true : false;
    const usersFilteredRender = usersRender.map((currentUser) => {
      if (currentUser.email === email) {
        currentUser.status = mfa;
      }
      return currentUser;
    });
    const usersFilteredOriginalData = originalData.map((currentUser) => {
      if (currentUser.email === email) {
        currentUser.status = mfa;
      }
      return currentUser;
    });
    const url =
      e.target.value === "enable"
        ? "/api/users/enable_mfa/"
        : "/api/users/disable_mfa/";

    const message = e.target.value === "enable" ? "MFA enable" : "MFA disable";
    apiDashboard
      .post(url, { user: email })
      .then(() => {
        setUsersRender(usersFilteredRender);
        setOriginalData(usersFilteredOriginalData);
        setLoad(false);
        setNotification({
          open: true,
          type: "success",
          message: message,
        });
      })
      .catch(() => {
        setLoad(false);
        setNotification({
          open: true,
          type: "error",
          message: "Failed",
        });
      });
  };
  const handleNextPage = (e: any, numberPage: number) => {
    const page = numberPage;
    const lastUser = page * usersPerPage;
    const firstUser = lastUser - usersPerPage;
    setPageSettings({
      ...pageSettings,
      currentPage: page,
      firstUser: firstUser,
      lastUser: lastUser,
    });
  };
  const handleChangeColorArrowSort = (direction: string, head: string) => {
    const setColors = Object.entries(colorArrowSort).map((header) =>
      header[0] === head ? { [header[0]]: direction } : { [header[0]]: "" }
    );
    setColorArrowSort({
      name: setColors[0].name,
      company: setColors[1].company,
      phone: setColors[2].phone,
      email: setColors[3].email,
    });
  };
  useEffect(() => {
    if (userHasPermission(["SUPER_ADMIN"])) {
      requestAPI();
    } else {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    if (apiUpdate) {
      handleUpdateFilters("", "searchValue");
      requestAPI();
      setApiUpdate(false);
    }
  }, [apiUpdate]);

  useEffect(() => {
    handleUsersSearch();
  }, [filters, sortTable]);

  return (
    <Suspense fallback="">
      <>
        <SnackBarMessage
          severityType={notification.type}
          message={notification.message}
          open={notification.open}
          onClose={() => {
            setNotification({ ...notification, open: false });
          }}
        />
        {load && (
          <S.LoadPage>
            <CircularProgress />
          </S.LoadPage>
        )}
        <S.Container>
          <header>
            <Breadcrumbs aria-label="breadcrumb" separator=">">
              <Link className="link-breadcrumbs" color="primary" href="/">
                Dashboard
              </Link>
              <Typography className="title-breadcrumbs" color="primary">
                Profile List
              </Typography>
            </Breadcrumbs>

            <nav>
              <S.Title>User Management</S.Title>

              <S.ButtonInvite onClick={() => setOpenModal(true)}>
                <AddIcon style={{ fontSize: "16px" }} />
                <span>Invite New User</span>
              </S.ButtonInvite>
            </nav>
          </header>
          <S.Content>
            {loadSpinner ? (
              <CircularProgress />
            ) : (
              <>
                <div className="search">
                  <input
                    type="text"
                    placeholder="Search by company or name or email..."
                    value={filters.searchValue}
                    onChange={(e) =>
                      handleUpdateFilters("searchValue", e.target.value)
                    }
                  />
                </div>
                <div className="tableUsers">
                  <TableUsers
                    listUsers={usersRender.slice(
                      pageSettings.firstUser,
                      pageSettings.lastUser
                    )}
                    setSortTable={setSortTable}
                    changeColorArrowSort={handleChangeColorArrowSort}
                    colorArrowSort={colorArrowSort}
                  />
                </div>
                <div className="tablePermisions">
                  <TablePermisions
                    listUsers={usersRender.slice(
                      pageSettings.firstUser,
                      pageSettings.lastUser
                    )}
                    handleChangeStatus={handleChangeStatus}
                    handleChangeMFA={handleChangeMFA}
                    setRoles={setRoles}
                    handleUpdateFilters={handleUpdateFilters}
                    handleUpdateFilterRoles={handleUpdateFilterRoles}
                    setSortTable={setSortTable}
                    changeColorArrowSort={handleChangeColorArrowSort}
                    colorArrowSort={colorArrowSort}
                  />
                </div>
                <div className="pagination">
                  <Pagination
                    count={pageSettings.totalPages}
                    onChange={handleNextPage}
                    page={pageSettings.currentPage}
                    size="small"
                    shape="rounded"
                  />
                </div>
              </>
            )}
          </S.Content>
          <ModalNewUser
            users={originalData}
            setOpen={setOpenModal}
            open={openModal}
            setApiUpdate={setApiUpdate}
          />
        </S.Container>
      </>
    </Suspense>
  );
};

export default UserManagement;
