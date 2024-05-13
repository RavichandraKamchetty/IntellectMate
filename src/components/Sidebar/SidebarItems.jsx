import CreatePost from "./CreatePost";
import Home from "./Home";
import Notifications from "./Notifications";
import Profile from "./Profile";
import Search from "./Search";

const SidebarItems = () => {
    return (
        <>
            <Home />
            <Search />
            <Notifications />
            <CreatePost />
            <Profile />
        </>
    );
};

export default SidebarItems;
