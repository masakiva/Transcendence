import { Dock } from "./Dock";
import Link from "next/link";
import { IconButton, Tooltip } from "@mui/material";
import Image from "next/image";
import styles from "../../styles/Home.module.css";
import FTLogo from "../../public/42logo.png";
import { SecondFactorLogin } from "../Alerts/SecondFactorLogin";
import getConfig from "next/config";
import userService from "../../services/user";
import authService from "../../services/auth";
import {useSessionContext} from "../../context/SessionContext";
import {useErrorContext} from "../../context/ErrorContext";
import {useSocketContext} from "../../context/SocketContext";
import {IUserSelf} from "../../interfaces/IUser";
import { Button } from "@mui/material";
import {errorHandler} from "../../errors/errorHandler";
import React, {
  EventHandler,
  FormEventHandler,
  useState,
} from "react";

const { publicRuntimeConfig } = getConfig();

export function DockGuest() {
  console.log("dockguest");
  const sessionContext = useSessionContext();
  const errorContext = useErrorContext();
  const socketContext = useSocketContext();
  const [username, setUsername] = useState("");

  const addUser = (event) => {
    userService
      .addOne('coucou')
      .then((user: IUserSelf) => {
        sessionContext.login?.(user);
        socketContext.socket.emit("user:new", username);
        setUsername("");

        authService
          .getToken('coucou')
          .then((login42: string) => {
            console.log("new token for", login42, "stored in cookie");
          })
          .catch((error) => {
            errorContext.newError?.(errorHandler(error, sessionContext));
            // errorContext.newError(errorParse)
          });
      })
      .catch((error) => {
        errorContext.newError?.(errorHandler(error, sessionContext));
      });
  };

  return (
    <>
      <Dock>
        <Link
          href={`http://${publicRuntimeConfig.HOST}:${publicRuntimeConfig.BACKEND_PORT}/auth`}
        >
          <Tooltip title="Login with your 42 account">
            <IconButton className={styles.icons} aria-label="Authentication">
              <Image src={FTLogo} alt="42 logo" layout={"fill"} />
            </IconButton>
          </Tooltip>
        </Link>
          <Button onClick={addUser}>create coucou</Button>
      </Dock>
      <SecondFactorLogin />
    </>
  );
}
