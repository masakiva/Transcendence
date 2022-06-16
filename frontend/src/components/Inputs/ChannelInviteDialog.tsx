import React, { useState } from "react";
import styles from "../../styles/Home.module.css";

import { TextField } from "../Inputs/TextField";
import { PasswordField } from "../Inputs/PasswordField";
import { inputPFState } from "../../interfaces/inputPasswordField";

import Switch from "@mui/material/Switch";

import { ButtonChannelInvite } from "../Buttons/ButtonChannelInvite";
import { Channel, IUserSlim } from "../../interfaces/IUser";

import channelService from "../../services/channel";
import { useLoginContext } from "../../context/LoginContext";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { CardUserChannelInvite } from "../Cards/CardUserChannelInvite";

import { EmptyInvitableFriendList } from "../Social/emptyPages";
import { useSocketContext } from "../../context/SocketContext";

function FriendList({
  friends,
  setSelectedFriends,
}: {
  friends: IUserSlim[];
  setSelectedFriends: (friends: IUserSlim) => void;
}) {
  return (
    <div className={styles.social_content}>
      {friends.map((friend) =>
        CardUserChannelInvite({ userInfos: friend, setSelectedFriends })
      )}
    </div>
  );
}

export function FriendContent({
  friends,
  setSelectedFriends,
}: {
  friends: IUserSlim[];
  setSelectedFriends: (friends: IUserSlim) => void;
}) {
  if (typeof friends === "undefined" || friends.length === 0) {
    return <EmptyInvitableFriendList />;
  } else {
    return (
      <FriendList friends={friends} setSelectedFriends={setSelectedFriends} />
    );
  }
}

export function ChannelInviteDialog({
  channel,
  open,
  setOpen,
}: {
  channel: Channel;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const loginContext = useLoginContext();
  const socketContext = useSocketContext();
  const [friends, setFriends] = useState<IUserSlim[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<IUserSlim[]>(
    []
  );

  React.useEffect(() => {
    channelService
      .getChannelInvitableFriends(loginContext.userLogin, channel.id)
      .then((friends: IUserSlim[]) => {
        setFriends(friends);
      });

    socketContext.socket.on("update-channel-content", () => {
      channelService
        .getChannelInvitableFriends(loginContext.userLogin, channel.id)
        .then((friends: IUserSlim[]) => {
          setFriends(friends);
        });
    });
    socketContext.socket.on("update-relations", () => {
      channelService
        .getChannelInvitableFriends(loginContext.userLogin, channel.id)
        .then((friends: IUserSlim[]) => {
          setFriends(friends);
        });
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const addSelectedFriend = (friend: IUserSlim) => {
    if (
      selectedFriends.find(
        (f: IUserSlim) => f.login42 === friend.login42
      )
    ) {
      setSelectedFriends(
        selectedFriends.filter(
          (f: IUserSlim) => f.login42 !== friend.login42
        )
      );
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const handleInvite = () => {
    setOpen(false);
    selectedFriends.forEach((friend: IUserSlim) => {
      channelService
        .inviteToChannel(loginContext.userLogin, channel.id, friend.login42)
        .then(() => {
          socketContext.socket.emit("user:update-channel-content");
        })
        .catch((err: Error) => {
          console.log(err);
        });
    });
  };

  return (
    <div className={styles.channel_settings}>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: "#163F5B",
            width: "779px",
            minWidth: "779px",
            height: "657px",
            minHeight: "657px",
          },
        }}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Invite friends</DialogTitle>
        <DialogContent>
          <FriendContent
            friends={friends}
            setSelectedFriends={addSelectedFriend}
          />
        </DialogContent>
        <DialogActions>
          <ButtonChannelInvite invite={handleInvite} />
        </DialogActions>
      </Dialog>
    </div>
  );
}
