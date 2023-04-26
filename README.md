# Transcendence

![Home](images/home.png)

This project is the very first web project we had to do at [42 Paris](https://42.fr/en/homepage/), and the last of the common core. We were required to build a Pong with online social features, as a single page app.

## ✨ Features

- A [Pong](https://en.wikipedia.org/wiki/Pong) game based on the original arcade game released in 1972, with PvP and PvE modes.
- A social interface, to display and manage your friends list, show friends' status etc.
- A messaging interface with private chats, and public / private channels.
- A leaderboard with the highest scores.

## 🧰 Built With

* [TypeScript](https://www.typescriptlang.org/) with [NextJS](https://nextjs.org/) (a [React](https://reactjs.org/) framework) - Frontend
* [TypeScript](https://www.typescriptlang.org/) with [NestJS](https://nestjs.com/) - Backend
* [PostGreSQL](https://www.postgresql.org/) and [TypeORM](https://typeorm.io/) - Database
* [Socket.io](https://socket.io/) - WebSockets
* [JSON Web Tokens](https://jwt.io/) - Authentication and authorization tokens
* [Docker-Compose](https://www.docker.com/) - Container management

## ▶️ Run the project

⚠️ In order to test this project you must have access to the 42 API and edit the private and public keys in `.env` and `.env.private` ⚠️

Clone the repo and run the following command :

```
docker-compose up --build
```

## ✏️ Design

Feel free to check our [Figma](https://www.figma.com/file/MmD9qKHpindbJGGaRwnkGh/Transcendance_final?node-id=0%3A1) for an overview of the frontend's expected look and feel.
We had a deadline to set the project as finished, so during development some elements of the design were left out in order to focus on a MVP.

## 📸 Screenshots

![loading](images/loading.png)

![pong](images/pong.png)

![Profile](images/profile.png)

![Friends](images/friends.png)

![channels_public_list](images/channels_public_list.png)

![channel](images/channel.png)

![new_DM](images/new_DM.png)

![Leaderboard](images/Leaderboard.png)


## 📚 Ressources

- [Full Stack open course](https://fullstackopen.com/en/)
- [CSS basics](https://developer.mozilla.org/fr/docs/Learn/Getting_started_with_the_web/CSS_basics)
- [HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)
- [JS Basics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
- [SASS documentation](https://sass-lang.com/guide)
- [React documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [NextJS documentation](https://nextjs.org/docs)
- [NestJS documentation](https://docs.nestjs.com/)
- [SocketIO documentation](https://socket.io/fr/get-started/chat)

## 👨‍💻 Authors

* [PiloucK](https://github.com/PiloucK/)
* [NotCampeur](https://github.com/NotCampeur)
* [masakiva](https://github.com/masakiva)
* [valentinllpz](https://github.com/valentinllpz)
