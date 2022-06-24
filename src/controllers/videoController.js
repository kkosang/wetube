const fakeUser = {
  username: "sanghyun",
  loggedIn: true,
};

let videos = [
  {
    title: "First video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 56,
    id: 1,
  },
  {
    title: "Second video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 56,
    id: 2,
  },
  {
    title: "Third video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 3,
  },
];
export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos: videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watching ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", {
    pageTitle: `Editing: ${video.title}`,
    video: video,
  });
};
export const postEdit = (req, res) => {};
