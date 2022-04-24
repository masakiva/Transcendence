import { ButtonLogout } from "../hooks/ButtonLogout";
import styles from "../styles/Home.module.css";
import { useLoginContext } from "../context/LoginContext";

import IconButton from "@mui/material/IconButton";
import CreateIcon from "@mui/icons-material/Create";
import CheckIcon from "@mui/icons-material/Check";
import TextField from "@mui/material/TextField";

import React from "react";
import { FormEventHandler, ChangeEventHandler, useState } from "react";
import userService from "../services/users";
import { IUser } from "../interfaces/users";

import io from "socket.io-client";

import Avatar from "@mui/material/Avatar";
import { DockGuest } from "../components/Dock/DockGuest";

import { useRouter } from "next/router";
import { UserGameHistory } from "../components/Profile/UserGameHistory";
import PublicProfile from "../components/Profile/publicprofile";

const socket = io("http://0.0.0.0:3002", { transports: ["websocket"] });

function MyUserName({ userInfos }: { userInfos: IUser }) {
  const loginContext = useLoginContext();
  const [isInModification, setIsInModification] = useState(false);
  const [tmpUsername, setTmpUsername] = useState(""); // tmpUsername -> usernameInput?

  const changeUsername: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsInModification(false);

    if (tmpUsername !== "") {
      userService
        .changeUsername(loginContext.userLogin, tmpUsername)
        .then(() => {
          setTmpUsername("");
          socket.emit("user:update-username");
        });
    }
  };

  const handleUsernameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setTmpUsername(event.target.value);
  };

  if (loginContext.userLogin === null) return null;
  if (isInModification === false) {
    return (
      <div className={styles.profile_user_account_details_username}>
        {userInfos.username}
        <IconButton
          className={styles.icons}
          aria-label="userName edit"
          onClick={() => setIsInModification(true)}
        >
          <CreateIcon />
        </IconButton>
      </div>
    );
  } else {
    return (
      <div className={styles.profile_user_account_details_username}>
        <form onSubmit={changeUsername}>
          <TextField
            value={tmpUsername}
            onChange={handleUsernameChange}
            label={userInfos.username}
          />
          <IconButton type="submit">
            <CheckIcon />
          </IconButton>
        </form>
      </div>
    );
  }
}

function MyAvatar() {
  return (
    <div className={styles.profile_user_account_details_avatar}>
      <Avatar
        img="/public/profile_icon.png"
        alt="avatar"
        sx={{ width: 151, height: 151 }}
      />
    </div>
  );
}

function MyAccountDetails({ userInfos }: { userInfos: IUser }) {
  return (
    <div className={styles.profile_user_account_details}>
      <div className={styles.profile_user_account_details_title}>
        Account details
      </div>
      <MyAvatar />
      <MyUserName userInfos={userInfos} />
    </div>
  );
}

function UserStats({ userInfos }: { userInfos: IUser }) {
  return (
    <div className={styles.profile_user_stats}>
      <div className={styles.profile_user_stats_header}>
        <div className={styles.profile_user_stats_header_title}>Stats</div>
      </div>
      <div className={styles.profile_user_stats_elo}>Elo: {userInfos.elo}</div>
      <div className={styles.profile_user_stats_games_summary}>
        Games won: {userInfos.gamesWon}
        <br />
        Games lost: {userInfos.gamesLost}
      </div>
    </div>
  );
}

function Profile({
  state,
}: {
  state: { userInfos: IUser; setUserInfos: (userInfos: IUser) => void };
}) {
  const loginContext = useLoginContext();

  React.useEffect(() => {
    socket.on("update-leaderboard", () => {
      userService.getOne(loginContext.userLogin).then((user: IUser) => {
        state.setUserInfos(user);
      });
    });
  }, []);

  return (
    <>
      <div className={styles.profile_user}>
        <MyAccountDetails userInfos={state.userInfos} />
        <UserStats userInfos={state.userInfos} />
        <ButtonLogout />
      </div>
      <UserGameHistory userLogin={loginContext.userLogin} />
    </>
  );
}

export default function ProfilePage() {
	const router = useRouter();
  const { login } = router.query;

	if (login !== undefined)
		return <PublicProfile login={login} />;
  const loginContext = useLoginContext();
  const [userInfos, setUserInfos] = useState<IUser>({
    id: "",
    login42: "",
    token42: "",
    twoFa: false,
    username: "",
    elo: 0,
    gamesWon: 0,
    gamesLost: 0,
  });

  if (
    loginContext.userLogin !== null &&
    loginContext.userLogin !== userInfos.login42
  ) {
    userService.getOne(loginContext.userLogin).then((user: IUser) => {
      setUserInfos(user);
    });
  }

  if (loginContext.userLogin === null) return <DockGuest />;
  return (
    <Profile state={{ userInfos: userInfos, setUserInfos: setUserInfos }} />
  );
}
